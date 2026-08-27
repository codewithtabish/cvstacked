"use server";

import prisma from "@/lib/prisma-client";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

// ============================================================
// TYPES
// ============================================================

interface CreateResumePaymentInput {
  resumeId: string;
  templateId: string;
}

interface CreateResumePaymentResult {
  success: boolean;
  checkoutUrl?: string;
  tracker?: string;
  purchaseId?: string;
  error?: string;
}

// ============================================================
// ENVIRONMENT
// ============================================================

const SAFEPAY_PUBLIC_KEY = process.env.SAFEPAY_PUBLIC_KEY?.trim();

const SAFEPAY_SECRET_KEY = process.env.SAFEPAY_SECRET_KEY?.trim();

const SAFEPAY_WEBHOOK_SECRET = process.env.SAFEPAY_WEBHOOK_SECRET?.trim();

const SAFEPAY_ENVIRONMENT = process.env.SAFEPAY_ENVIRONMENT?.trim().toLowerCase() || "sandbox";

const SAFEPAY_API_BASE_URL =
  process.env.SAFEPAY_API_BASE_URL?.trim() || "https://sandbox.api.getsafepay.com";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "http://localhost:3000";

const IS_SANDBOX = SAFEPAY_ENVIRONMENT === "sandbox";

const EXPECTED_API_BASE_URL = IS_SANDBOX
  ? "https://sandbox.api.getsafepay.com"
  : "https://api.getsafepay.com";

const SAFEPAY_CHECKOUT_BASE_URL = IS_SANDBOX
  ? "https://sandbox.api.getsafepay.com/checkout/pay"
  : "https://api.getsafepay.com/checkout/pay";

// ============================================================
// CONSTANTS
// ============================================================

const RESUME_PRICE_CENTS = 300;
const RESUME_CURRENCY = "USD";

// ============================================================
// SAFE LOGGING
// ============================================================

function maskSecret(value: string | undefined): string {
  if (!value) {
    return "MISSING";
  }

  if (value.length <= 8) {
    return "***";
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function maskToken(value: string | undefined): string {
  if (!value) {
    return "MISSING";
  }

  if (value.length <= 12) {
    return "***";
  }

  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

function logSafepayEnvironment(): void {
  console.log("");
  console.log("============================================================");
  console.log("[Safepay] ENVIRONMENT DEBUG");
  console.log("============================================================");

  console.log("[Safepay] SAFEPAY_ENVIRONMENT:", SAFEPAY_ENVIRONMENT);

  console.log("[Safepay] SAFEPAY_API_BASE_URL:", SAFEPAY_API_BASE_URL);

  console.log("[Safepay] APP_URL:", APP_URL);

  console.log("[Safepay] SAFEPAY_PUBLIC_KEY:", maskSecret(SAFEPAY_PUBLIC_KEY));

  console.log("[Safepay] SAFEPAY_SECRET_KEY:", maskSecret(SAFEPAY_SECRET_KEY));

  console.log("[Safepay] SAFEPAY_WEBHOOK_SECRET:", maskSecret(SAFEPAY_WEBHOOK_SECRET));

  console.log("[Safepay] IS_SANDBOX:", IS_SANDBOX);

  console.log("[Safepay] EXPECTED_API_BASE_URL:", EXPECTED_API_BASE_URL);

  console.log("[Safepay] SAFEPAY_CHECKOUT_BASE_URL:", SAFEPAY_CHECKOUT_BASE_URL);

  console.log("[Safepay] API URL MATCH:", SAFEPAY_API_BASE_URL === EXPECTED_API_BASE_URL);

  console.log("============================================================");
  console.log("");
}

// ============================================================
// SAFEPAY ERROR MESSAGE
// ============================================================

function getSafepayErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "Safepay returned an unknown error.";
  }

  const data = payload as Record<string, unknown>;

  if (data.status && typeof data.status === "object") {
    const status = data.status as Record<string, unknown>;

    if (typeof status.message === "string" && status.message.trim()) {
      return status.message;
    }

    if (Array.isArray(status.errors) && status.errors.length > 0) {
      const firstError = status.errors[0];

      if (typeof firstError === "string" && firstError.trim()) {
        return firstError;
      }

      if (firstError && typeof firstError === "object") {
        const errorObject = firstError as Record<string, unknown>;

        if (typeof errorObject.message === "string" && errorObject.message.trim()) {
          return errorObject.message;
        }
      }
    }
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }

  return "Safepay request failed.";
}

// ============================================================
// READ SAFEPAY RESPONSE
// ============================================================

async function readSafepayResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";

  try {
    if (contentType.toLowerCase().includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();

    if (!text.trim()) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

// ============================================================
// MARK PURCHASE FAILED
// ============================================================

async function markPurchaseFailed(purchaseId: string): Promise<void> {
  try {
    await prisma.resumePurchase.update({
      where: {
        id: purchaseId,
      },
      data: {
        status: "FAILED",
      },
    });
  } catch (error) {
    console.error("[Create Resume Payment] Failed to mark purchase as FAILED:", error);
  }
}

// ============================================================
// CREATE PAYMENT
// ============================================================

export async function createResumePaymentAction(
  input: CreateResumePaymentInput,
): Promise<CreateResumePaymentResult> {
  console.log("");
  console.log("============================================================");
  console.log("[Create Resume Payment] ACTION CALLED");
  console.log("============================================================");

  logSafepayEnvironment();

  let purchaseId: string | undefined;

  try {
    // ========================================================
    // 1. AUTHENTICATION
    // ========================================================

    console.log("[Create Resume Payment] Step 1: Checking authentication...");

    const { userId: clerkUserId } = await auth();

    console.log(
      "[Create Resume Payment] Clerk user:",
      clerkUserId ? `${clerkUserId.slice(0, 8)}...` : "NOT AUTHENTICATED",
    );

    if (!clerkUserId) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    // ========================================================
    // 2. ENVIRONMENT VALIDATION
    // ========================================================

    console.log("[Create Resume Payment] Step 2: Validating Safepay configuration...");

    if (!SAFEPAY_PUBLIC_KEY) {
      return {
        success: false,
        error: "SAFEPAY_PUBLIC_KEY is not configured.",
      };
    }

    if (!SAFEPAY_SECRET_KEY) {
      return {
        success: false,
        error: "SAFEPAY_SECRET_KEY is not configured.",
      };
    }

    if (!SAFEPAY_ENVIRONMENT) {
      return {
        success: false,
        error: "SAFEPAY_ENVIRONMENT is not configured.",
      };
    }

    if (SAFEPAY_ENVIRONMENT !== "sandbox" && SAFEPAY_ENVIRONMENT !== "production") {
      return {
        success: false,
        error: 'SAFEPAY_ENVIRONMENT must be either "sandbox" or "production".',
      };
    }

    if (SAFEPAY_API_BASE_URL !== EXPECTED_API_BASE_URL) {
      console.error("[Create Resume Payment] Environment/API mismatch:", {
        environment: SAFEPAY_ENVIRONMENT,
        configuredApiUrl: SAFEPAY_API_BASE_URL,
        expectedApiUrl: EXPECTED_API_BASE_URL,
      });

      return {
        success: false,
        error:
          `Safepay environment mismatch. ` +
          `"${SAFEPAY_ENVIRONMENT}" requires ` +
          `"${EXPECTED_API_BASE_URL}" as SAFEPAY_API_BASE_URL.`,
      };
    }

    console.log("[Create Resume Payment] Safepay environment configuration is VALID.");

    // ========================================================
    // 3. INPUT VALIDATION
    // ========================================================

    console.log("[Create Resume Payment] Step 3: Validating input...");

    if (!input || typeof input !== "object") {
      return {
        success: false,
        error: "Invalid payment data.",
      };
    }

    const resumeId = typeof input.resumeId === "string" ? input.resumeId.trim() : "";

    const templateId = typeof input.templateId === "string" ? input.templateId.trim() : "";

    console.log("[Create Resume Payment] resumeId:", resumeId);

    console.log("[Create Resume Payment] templateId:", templateId);

    if (!resumeId) {
      return {
        success: false,
        error: "Resume ID is required.",
      };
    }

    if (!templateId) {
      return {
        success: false,
        error: "Template ID is required.",
      };
    }

    // ========================================================
    // 4. DATABASE USER
    // ========================================================

    console.log("[Create Resume Payment] Step 4: Finding database user...");

    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUserId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Your account is not available yet. Please refresh and try again.",
      };
    }

    console.log("[Create Resume Payment] Database user found:", user.id);

    // ========================================================
    // 5. FIND RESUME
    // ========================================================

    console.log("[Create Resume Payment] Step 5: Finding resume...");

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: user.id,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        resumeTemplateId: true,
      },
    });

    if (!resume) {
      return {
        success: false,
        error: "Resume not found.",
      };
    }

    console.log("[Create Resume Payment] Resume found:", {
      id: resume.id,
      name: resume.name,
      templateId: resume.resumeTemplateId,
    });

    if (resume.resumeTemplateId !== templateId) {
      return {
        success: false,
        error: "The selected template does not match this resume.",
      };
    }

    // ========================================================
    // 6. EXISTING PURCHASE
    // ========================================================

    console.log("[Create Resume Payment] Step 6: Checking existing purchases...");

    const existingPurchase = await prisma.resumePurchase.findFirst({
      where: {
        userId: user.id,
        resumeId: resume.id,
        productType: "RESUME",
        status: {
          in: ["PENDING", "PAID"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        tracker: true,
      },
    });

    if (existingPurchase?.status === "PAID") {
      console.log("[Create Resume Payment] Resume is already paid.");

      return {
        success: false,
        purchaseId: existingPurchase.id,
        error: "This resume has already been paid for.",
      };
    }

    if (existingPurchase?.status === "PENDING") {
      console.log("[Create Resume Payment] Existing PENDING purchase:", existingPurchase.id);

      await markPurchaseFailed(existingPurchase.id);
    } else {
      console.log("[Create Resume Payment] No existing purchase found.");
    }

    // ========================================================
    // 7. CREATE LOCAL PURCHASE
    // ========================================================

    console.log("[Create Resume Payment] Step 7: Creating local purchase...");

    const purchase = await prisma.resumePurchase.create({
      data: {
        userId: user.id,
        resumeId: resume.id,
        productType: "RESUME",
        provider: "safepay",
        tracker: `resume_${randomUUID()}`,
        amount: RESUME_PRICE_CENTS,
        currency: RESUME_CURRENCY,
        status: "PENDING",
      },
      select: {
        id: true,
        tracker: true,
        amount: true,
        currency: true,
      },
    });

    purchaseId = purchase.id;

    console.log("[Create Resume Payment] Local purchase created:", {
      purchaseId: purchase.id,
      amount: purchase.amount,
      currency: purchase.currency,
    });

    // ========================================================
    // 8. CREATE SAFEPAY PAYMENT SESSION
    // ========================================================

    console.log("[Create Resume Payment] Step 8: Creating Safepay tracker...");

    const trackerEndpoint = `${SAFEPAY_API_BASE_URL}/order/payments/v3/`;

    console.log("[Create Resume Payment] Tracker endpoint:", trackerEndpoint);

    // IMPORTANT:
    //
    // Safepay currently rejects unsupported metadata
    // keys. Only order_id is sent here.
    //
    const trackerRequestBody = {
      merchant_api_key: SAFEPAY_PUBLIC_KEY,

      intent: "CYBERSOURCE",

      mode: "payment",

      entry_mode: "raw",

      currency: RESUME_CURRENCY,

      amount: RESUME_PRICE_CENTS,

      include_fees: false,

      metadata: {
        order_id: purchase.id,
      },
    };

    console.log("[Create Resume Payment] Tracker request:", trackerRequestBody);

    const trackerResponse = await fetch(trackerEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SAFEPAY_SECRET_KEY}`,

        "Content-Type": "application/json",

        Accept: "application/json",
      },

      body: JSON.stringify(trackerRequestBody),

      cache: "no-store",
    });

    const trackerPayload = await readSafepayResponse(trackerResponse);

    console.log("[Create Resume Payment] Tracker HTTP status:", trackerResponse.status);

    console.log("[Create Resume Payment] Tracker response:", trackerPayload);

    if (!trackerResponse.ok) {
      console.error("[Create Resume Payment] Safepay tracker creation FAILED.");

      await markPurchaseFailed(purchase.id);

      return {
        success: false,
        purchaseId: purchase.id,
        error: getSafepayErrorMessage(trackerPayload),
      };
    }

    // ========================================================
    // 9. EXTRACT TRACKER
    // ========================================================

    const trackerRoot =
      trackerPayload && typeof trackerPayload === "object"
        ? (trackerPayload as Record<string, unknown>)
        : null;

    const trackerData =
      trackerRoot?.data && typeof trackerRoot.data === "object"
        ? (trackerRoot.data as Record<string, unknown>)
        : null;

    const trackerObject =
      trackerData?.tracker && typeof trackerData.tracker === "object"
        ? (trackerData.tracker as Record<string, unknown>)
        : null;

    const trackerToken = typeof trackerObject?.token === "string" ? trackerObject.token.trim() : "";

    const trackerEnvironment =
      typeof trackerObject?.environment === "string"
        ? trackerObject.environment.trim().toLowerCase()
        : "";

    console.log("[Create Resume Payment] Tracker token:", maskToken(trackerToken));

    console.log(
      "[Create Resume Payment] Tracker environment:",
      trackerEnvironment || "NOT_RETURNED",
    );

    if (!trackerToken) {
      console.error("[Create Resume Payment] Safepay did not return a tracker token.");

      await markPurchaseFailed(purchase.id);

      return {
        success: false,
        purchaseId: purchase.id,
        error: "Safepay did not return a payment tracker. Please try again.",
      };
    }

    // ========================================================
    // 10. VERIFY TRACKER ENVIRONMENT
    // ========================================================

    if (trackerEnvironment && trackerEnvironment !== SAFEPAY_ENVIRONMENT) {
      console.error("[Create Resume Payment] Tracker environment mismatch:", {
        trackerEnvironment,
        configuredEnvironment: SAFEPAY_ENVIRONMENT,
      });

      await markPurchaseFailed(purchase.id);

      return {
        success: false,
        purchaseId: purchase.id,
        error:
          "Safepay payment environment mismatch. Please check your Safepay test/live API keys.",
      };
    }

    // ========================================================
    // 11. CREATE AUTHENTICATION TOKEN
    // ========================================================

    console.log("[Create Resume Payment] Step 11: Creating Safepay authentication token...");

    const authTokenEndpoint = `${SAFEPAY_API_BASE_URL}/client/passport/v1/token`;

    console.log("[Create Resume Payment] Auth endpoint:", authTokenEndpoint);

    const authTokenResponse = await fetch(authTokenEndpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Accept: "application/json",

        "X-SFPY-MERCHANT-SECRET": SAFEPAY_SECRET_KEY,
      },

      body: JSON.stringify({}),

      cache: "no-store",
    });

    const authTokenPayload = await readSafepayResponse(authTokenResponse);

    console.log("[Create Resume Payment] Auth HTTP status:", authTokenResponse.status);

    console.log(
      "[Create Resume Payment] Auth response:",
      authTokenPayload && typeof authTokenPayload === "object"
        ? {
            hasData: "data" in (authTokenPayload as Record<string, unknown>),
          }
        : authTokenPayload,
    );

    if (!authTokenResponse.ok) {
      console.error("[Create Resume Payment] Safepay auth token creation FAILED.");

      await markPurchaseFailed(purchase.id);

      return {
        success: false,
        purchaseId: purchase.id,
        error: getSafepayErrorMessage(authTokenPayload),
      };
    }

    // ========================================================
    // 12. EXTRACT AUTH TOKEN
    // ========================================================

    const authRoot =
      authTokenPayload && typeof authTokenPayload === "object"
        ? (authTokenPayload as Record<string, unknown>)
        : null;

    let authToken = "";

    // Official Safepay response:
    //
    // {
    //   "data": "..."
    // }
    //
    if (typeof authRoot?.data === "string") {
      authToken = authRoot.data.trim();
    }

    // Defensive support for object response.
    if (!authToken && authRoot?.data && typeof authRoot.data === "object") {
      const data = authRoot.data as Record<string, unknown>;

      if (typeof data.token === "string") {
        authToken = data.token.trim();
      }
    }

    // Defensive support for top-level token.
    if (!authToken && typeof authRoot?.token === "string") {
      authToken = authRoot.token.trim();
    }

    console.log("[Create Resume Payment] Auth token:", maskToken(authToken));

    if (!authToken) {
      console.error("[Create Resume Payment] Safepay auth token missing.");

      await markPurchaseFailed(purchase.id);

      return {
        success: false,
        purchaseId: purchase.id,
        error: "Safepay authentication token was not created.",
      };
    }

    // ========================================================
    // 13. BUILD CHECKOUT URL
    // ========================================================

    console.log("[Create Resume Payment] Step 13: Generating Safepay Checkout URL...");

    const redirectUrl = `${APP_URL}/app/resumes/${encodeURIComponent(resume.id)}/payment/success`;

    const cancelUrl = `${APP_URL}/app/resumes/${encodeURIComponent(resume.id)}/payment/cancel`;

    console.log("[Create Resume Payment] Redirect URL:", redirectUrl);

    console.log("[Create Resume Payment] Cancel URL:", cancelUrl);

    console.log("[Create Resume Payment] Checkout base:", SAFEPAY_CHECKOUT_BASE_URL);

    // ========================================================
    // SAFEPAY DOCUMENTED HOSTED CHECKOUT PARAMETERS
    // ========================================================

    const checkoutUrl = new URL(SAFEPAY_CHECKOUT_BASE_URL);

    checkoutUrl.searchParams.set("tracker", trackerToken);

    checkoutUrl.searchParams.set("tbt", authToken);

    checkoutUrl.searchParams.set("environment", SAFEPAY_ENVIRONMENT);

    checkoutUrl.searchParams.set("source", "hosted");

    checkoutUrl.searchParams.set("redirect_url", redirectUrl);

    checkoutUrl.searchParams.set("cancel_url", cancelUrl);

    // ========================================================
    // 14. CHECK GENERATED URL
    // ========================================================

    const generatedCheckoutParams = {
      protocol: checkoutUrl.protocol,

      host: checkoutUrl.host,

      pathname: checkoutUrl.pathname,

      hasTracker: checkoutUrl.searchParams.has("tracker"),

      tracker: maskToken(checkoutUrl.searchParams.get("tracker") || undefined),

      hasTbt: checkoutUrl.searchParams.has("tbt"),

      tbt: maskToken(checkoutUrl.searchParams.get("tbt") || undefined),

      environment: checkoutUrl.searchParams.get("environment"),

      source: checkoutUrl.searchParams.get("source"),

      hasRedirectUrl: checkoutUrl.searchParams.has("redirect_url"),

      redirectUrl: checkoutUrl.searchParams.get("redirect_url"),

      hasCancelUrl: checkoutUrl.searchParams.has("cancel_url"),

      cancelUrl: checkoutUrl.searchParams.get("cancel_url"),
    };

    console.log("[Create Resume Payment] Generated checkout parameters:", generatedCheckoutParams);

    // ========================================================
    // STRICT VALIDATION
    // ========================================================

    const checkoutIsValid =
      checkoutUrl.protocol === "https:" &&
      checkoutUrl.host === new URL(SAFEPAY_CHECKOUT_BASE_URL).host &&
      checkoutUrl.pathname === "/checkout/pay" &&
      checkoutUrl.searchParams.get("tracker") === trackerToken &&
      checkoutUrl.searchParams.get("tbt") === authToken &&
      checkoutUrl.searchParams.get("environment") === SAFEPAY_ENVIRONMENT &&
      checkoutUrl.searchParams.get("source") === "hosted" &&
      checkoutUrl.searchParams.get("redirect_url") === redirectUrl &&
      checkoutUrl.searchParams.get("cancel_url") === cancelUrl;

    console.log("[Create Resume Payment] Checkout URL VALID:", checkoutIsValid);

    if (!checkoutIsValid) {
      console.error("[Create Resume Payment] Checkout URL validation FAILED.");

      await markPurchaseFailed(purchase.id);

      return {
        success: false,
        purchaseId: purchase.id,
        error: "Safepay checkout URL could not be generated correctly.",
      };
    }

    // ========================================================
    // IMPORTANT DEBUGGING OUTPUT
    // ========================================================
    //
    // Do NOT log the full URL because tbt is sensitive.
    //
    console.log("[Create Resume Payment] Checkout origin:", checkoutUrl.origin);

    console.log("[Create Resume Payment] Checkout pathname:", checkoutUrl.pathname);

    console.log(
      "[Create Resume Payment] Checkout query keys:",
      Array.from(checkoutUrl.searchParams.keys()),
    );

    // ========================================================
    // 15. SAVE SAFEPAY TRACKER
    // ========================================================

    console.log("[Create Resume Payment] Step 15: Saving Safepay tracker...");

    await prisma.resumePurchase.update({
      where: {
        id: purchase.id,
      },
      data: {
        tracker: trackerToken,
      },
    });

    console.log("[Create Resume Payment] Purchase updated with Safepay tracker:", {
      purchaseId: purchase.id,
      tracker: maskToken(trackerToken),
    });

    // ========================================================
    // 16. FINAL SUCCESS
    // ========================================================

    console.log("");
    console.log("============================================================");

    console.log("[Create Resume Payment] PAYMENT SESSION CREATED SUCCESSFULLY");

    console.log("[Create Resume Payment] Environment:", SAFEPAY_ENVIRONMENT);

    console.log("[Create Resume Payment] Tracker:", maskToken(trackerToken));

    console.log("[Create Resume Payment] Checkout host:", checkoutUrl.host);

    console.log("[Create Resume Payment] Checkout path:", checkoutUrl.pathname);

    console.log("============================================================");
    console.log("");

    return {
      success: true,
      checkoutUrl: checkoutUrl.toString(),
      tracker: trackerToken,
      purchaseId: purchase.id,
    };
  } catch (error) {
    console.error("");
    console.error("============================================================");

    console.error("[Create Resume Payment] ACTION FAILED");

    console.error("============================================================");

    console.error(error);

    if (purchaseId) {
      await markPurchaseFailed(purchaseId);
    }

    return {
      success: false,
      purchaseId,
      error: error instanceof Error ? error.message : getSafepayErrorMessage(error),
    };
  }
}
