import prisma from "@/lib/prisma-client";

import { createHmac, timingSafeEqual } from "crypto";

// ============================================================
// TYPES
// ============================================================

interface SafepayWebhookPayload {
  id?: string;

  event?: string;

  type?: string;

  data?: {
    tracker?: string;

    payment_id?: string;

    paymentId?: string;

    status?: string;

    state?: string;

    [key: string]: unknown;
  };

  tracker?: string;

  payment_id?: string;

  paymentId?: string;

  status?: string;

  state?: string;

  [key: string]: unknown;
}

// ============================================================
// ENVIRONMENT
// ============================================================

const WEBHOOK_SECRET = process.env.SAFEPAY_WEBHOOK_SECRET;

// ============================================================
// HELPERS
// ============================================================

function getHeader(request: Request, ...names: string[]): string | null {
  for (const name of names) {
    const value = request.headers.get(name);

    if (value) {
      return value.trim();
    }
  }

  return null;
}

// ============================================================

function safeCompare(received: string, expected: string): boolean {
  const receivedBuffer = Buffer.from(received);

  const expectedBuffer = Buffer.from(expected);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}

// ============================================================
// WEBHOOK SIGNATURE
// ============================================================

/**
 * Safepay signs:
 *
 * timestamp + "." + raw request body
 *
 * Current Safepay webhook documentation specifies
 * SHA-256 and the `sha256=` signature format.
 *
 * The webhook secret is base64 encoded in the
 * current webhook flow, so we decode it first.
 */
function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  timestamp: string,
  secret: string,
): boolean {
  let secretKey: Buffer;

  try {
    secretKey = Buffer.from(secret, "base64");
  } catch {
    return false;
  }

  if (secretKey.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;

  const expectedDigest = createHmac("sha256", secretKey).update(signedPayload).digest("hex");

  const expectedSignature = `sha256=${expectedDigest}`;

  return safeCompare(signature, expectedSignature);
}

// ============================================================
// TRACKER
// ============================================================

function getTracker(payload: SafepayWebhookPayload): string | null {
  const tracker = payload.tracker ?? payload.data?.tracker ?? null;

  if (typeof tracker === "string" && tracker.trim().length > 0) {
    return tracker.trim();
  }

  return null;
}

// ============================================================
// PAYMENT ID
// ============================================================

function getPaymentId(payload: SafepayWebhookPayload): string | null {
  const paymentId =
    payload.payment_id ??
    payload.paymentId ??
    payload.data?.payment_id ??
    payload.data?.paymentId ??
    null;

  if (typeof paymentId === "string" && paymentId.trim().length > 0) {
    return paymentId.trim();
  }

  return null;
}

// ============================================================
// EVENT TYPE
// ============================================================

function getEventType(payload: SafepayWebhookPayload): string {
  const event = payload.event ?? payload.type ?? "unknown";

  return typeof event === "string" ? event : "unknown";
}

// ============================================================
// PAYMENT STATUS
// ============================================================

function getPaymentStatus(payload: SafepayWebhookPayload): string | null {
  const status =
    payload.status ?? payload.state ?? payload.data?.status ?? payload.data?.state ?? null;

  if (typeof status === "string" && status.trim().length > 0) {
    return status.trim().toLowerCase();
  }

  return null;
}

// ============================================================
// POST
// ============================================================

export async function POST(request: Request) {
  try {
    // ========================================================
    // 1. WEBHOOK SECRET
    // ========================================================

    if (!WEBHOOK_SECRET) {
      console.error("[Safepay Webhook] SAFEPAY_WEBHOOK_SECRET is missing.");

      return Response.json(
        {
          success: false,
          error: "Webhook configuration error.",
        },
        {
          status: 500,
        },
      );
    }

    // ========================================================
    // 2. HEADERS
    // ========================================================

    const signature = getHeader(request, "X-SFPY-SIGNATURE", "x-sfpy-signature");

    const timestamp = getHeader(request, "X-SFPY-TIMESTAMP", "x-sfpy-timestamp");

    const eventId = getHeader(request, "X-SFPY-EVENT-ID", "x-sfpy-event-id");

    const eventTypeHeader = getHeader(request, "X-SFPY-EVENT-TYPE", "x-sfpy-event-type");

    // ========================================================
    // 3. RAW BODY
    //
    // VERY IMPORTANT:
    //
    // Do not JSON.parse() before signature verification.
    // ========================================================

    const rawBody = await request.text();

    if (!rawBody) {
      console.error("[Safepay Webhook] Empty request body.");

      return Response.json(
        {
          success: false,
          error: "Empty webhook body.",
        },
        {
          status: 400,
        },
      );
    }

    // ========================================================
    // 4. SIGNATURE HEADERS
    // ========================================================

    if (!signature || !timestamp) {
      console.error("[Safepay Webhook] Missing signature headers.");

      return Response.json(
        {
          success: false,
          error: "Missing Safepay signature headers.",
        },
        {
          status: 401,
        },
      );
    }

    // ========================================================
    // 5. VERIFY SIGNATURE
    // ========================================================

    const validSignature = verifyWebhookSignature(rawBody, signature, timestamp, WEBHOOK_SECRET);

    if (!validSignature) {
      console.error("[Safepay Webhook] Invalid signature.");

      return Response.json(
        {
          success: false,
          error: "Invalid webhook signature.",
        },
        {
          status: 401,
        },
      );
    }

    // ========================================================
    // 6. PARSE JSON
    //
    // Only AFTER signature verification.
    // ========================================================

    let payload: SafepayWebhookPayload;

    try {
      payload = JSON.parse(rawBody) as SafepayWebhookPayload;
    } catch (error) {
      console.error("[Safepay Webhook] Invalid JSON:", error);

      return Response.json(
        {
          success: false,
          error: "Invalid JSON payload.",
        },
        {
          status: 400,
        },
      );
    }

    // ========================================================
    // 7. EXTRACT EVENT DATA
    // ========================================================

    const eventType = eventTypeHeader ?? getEventType(payload);

    const tracker = getTracker(payload);

    const paymentId = getPaymentId(payload);

    const status = getPaymentStatus(payload);

    // ========================================================
    // 8. IDEMPOTENCY
    // ========================================================

    if (eventId) {
      const existingEvent = await prisma.paymentEvent.findFirst({
        where: {
          provider: "safepay",
          eventId,
        },

        select: {
          id: true,
        },
      });

      if (existingEvent) {
        console.log("[Safepay Webhook] Duplicate event:", eventId);

        return Response.json({
          success: true,
          duplicate: true,
        });
      }
    }

    // ========================================================
    // 9. SAVE EVENT
    // ========================================================

    await prisma.paymentEvent.create({
      data: {
        provider: "safepay",

        eventId: eventId ?? undefined,

        eventType,

        tracker: tracker ?? undefined,

        payload: payload as object,
      },
    });

    // ========================================================
    // 10. NO TRACKER
    // ========================================================

    if (!tracker) {
      console.warn("[Safepay Webhook] Event has no tracker:", eventType);

      return Response.json({
        success: true,
        processed: false,
        reason: "No tracker supplied.",
      });
    }

    // ========================================================
    // 11. FIND PURCHASE
    // ========================================================

    const purchase = await prisma.resumePurchase.findUnique({
      where: {
        tracker,
      },

      select: {
        id: true,
        userId: true,
        resumeId: true,
        resumeAIOptimizerId: true,
        productType: true,
        status: true,
        amount: true,
        currency: true,
        paymentId: true,
      },
    });

    if (!purchase) {
      console.warn("[Safepay Webhook] Purchase not found:", {
        tracker,
        eventType,
      });

      // The event was already persisted.
      // Return 200 so Safepay does not retry
      // forever for an unknown tracker.
      return Response.json({
        success: true,
        processed: false,
        reason: "Purchase not found.",
      });
    }

    // ========================================================
    // 12. STATUS MAPS
    // ========================================================

    const successfulStatuses = new Set([
      "paid",
      "success",
      "successful",
      "completed",
      "complete",
      "succeeded",
      "captured",
      "settled",
    ]);

    const failedStatuses = new Set(["failed", "failure", "declined", "expired"]);

    const cancelledStatuses = new Set(["cancelled", "canceled"]);

    const refundedStatuses = new Set(["refunded", "refund"]);

    // ========================================================
    // 13. SUCCESS
    // ========================================================

    if (status && successfulStatuses.has(status)) {
      // Never downgrade PAID.
      if (purchase.status !== "PAID") {
        await prisma.resumePurchase.update({
          where: {
            id: purchase.id,
          },

          data: {
            status: "PAID",

            paymentId: paymentId ?? undefined,

            paidAt: new Date(),
          },
        });

        console.log("[Safepay Webhook] Purchase marked PAID:", {
          purchaseId: purchase.id,

          tracker,

          productType: purchase.productType,
        });
      }

      return Response.json({
        success: true,
        processed: true,
        status: "PAID",
        purchaseId: purchase.id,
      });
    }

    // ========================================================
    // 14. CANCELLED
    // ========================================================

    if (status && cancelledStatuses.has(status)) {
      if (purchase.status !== "PAID" && purchase.status !== "REFUNDED") {
        await prisma.resumePurchase.update({
          where: {
            id: purchase.id,
          },

          data: {
            status: "CANCELLED",

            paymentId: paymentId ?? undefined,
          },
        });

        console.log("[Safepay Webhook] Purchase cancelled:", {
          purchaseId: purchase.id,

          tracker,
        });
      }

      return Response.json({
        success: true,
        processed: true,
        status: "CANCELLED",
        purchaseId: purchase.id,
      });
    }

    // ========================================================
    // 15. FAILED
    // ========================================================

    if (status && failedStatuses.has(status)) {
      if (purchase.status !== "PAID" && purchase.status !== "REFUNDED") {
        await prisma.resumePurchase.update({
          where: {
            id: purchase.id,
          },

          data: {
            status: "FAILED",

            paymentId: paymentId ?? undefined,
          },
        });

        console.log("[Safepay Webhook] Purchase failed:", {
          purchaseId: purchase.id,

          tracker,

          status,
        });
      }

      return Response.json({
        success: true,
        processed: true,
        status: "FAILED",
        purchaseId: purchase.id,
      });
    }

    // ========================================================
    // 16. REFUNDED
    // ========================================================

    if (status && refundedStatuses.has(status)) {
      await prisma.resumePurchase.update({
        where: {
          id: purchase.id,
        },

        data: {
          status: "REFUNDED",

          paymentId: paymentId ?? undefined,
        },
      });

      console.log("[Safepay Webhook] Purchase refunded:", {
        purchaseId: purchase.id,

        tracker,
      });

      return Response.json({
        success: true,
        processed: true,
        status: "REFUNDED",
        purchaseId: purchase.id,
      });
    }

    // ========================================================
    // 17. INFORMATIONAL EVENT
    // ========================================================

    console.log("[Safepay Webhook] Informational event:", {
      eventType,
      tracker,
      paymentId,
      status,
    });

    return Response.json({
      success: true,
      processed: false,
      eventType,
      tracker,
      status,
    });
  } catch (error) {
    console.error("[Safepay Webhook] Fatal error:", error);

    return Response.json(
      {
        success: false,
        error: "Webhook processing failed.",
      },
      {
        status: 500,
      },
    );
  }
}

// ============================================================
// GET
// ============================================================

export async function GET() {
  return Response.json({
    success: true,

    service: "CVStacked Safepay Webhook",

    status: "ready",
  });
}
