import prisma from "@/lib/prisma-client";
import { auth } from "@clerk/nextjs/server";
import Safepay from "@sfpy/node-core";

// ============================================================
// CONFIG
// ============================================================

const SAFEPAY_SECRET_KEY = process.env.SAFEPAY_SECRET_KEY;

const SAFEPAY_API_BASE_URL =
  process.env.SAFEPAY_API_BASE_URL || "https://sandbox.api.getsafepay.com";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ============================================================
// PRODUCTS
// ============================================================

const PRODUCTS = {
  RESUME: {
    amount: 300,
    currency: "USD",
  },

  AI_OPTIMIZER: {
    amount: 400,
    currency: "USD",
  },
} as const;

type ProductType = keyof typeof PRODUCTS;

// ============================================================
// REQUEST TYPES
// ============================================================

interface CreatePaymentRequest {
  /**
   * Product being purchased.
   */
  productType: ProductType;

  /**
   * Prisma Resume.id.
   *
   * IMPORTANT:
   *
   * This is NOT templateId.
   *
   * Example:
   *
   * resume.id
   * = "cm123abc..."
   *
   * resume.templateId
   * = "tpl_7f3k9x2m"
   */
  resumeId?: string;

  /**
   * Latest complete resume state.
   *
   * The latest resume content is persisted before
   * the Safepay checkout is created.
   */
  resume?: Record<string, unknown>;

  /**
   * Prisma ResumeAIOptimizer.id.
   */
  resumeAIOptimizerId?: string;
}

// ============================================================
// SAFEPAy CLIENT
// ============================================================

function createSafepayClient(): any {
  if (!SAFEPAY_SECRET_KEY) {
    throw new Error("Missing SAFEPAY_SECRET_KEY environment variable.");
  }

  return new Safepay(SAFEPAY_SECRET_KEY, {
    authType: "secret",
    host: SAFEPAY_API_BASE_URL,
  }) as any;
}

// ============================================================
// RESUME HELPERS
// ============================================================

function getResumeName(resume: Record<string, unknown>): string {
  const nameCandidates = [resume.name, resume.title];

  for (const value of nameCandidates) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  const personalInfo = resume.personalInfo;

  if (personalInfo && typeof personalInfo === "object" && !Array.isArray(personalInfo)) {
    const info = personalInfo as Record<string, unknown>;

    if (typeof info.fullName === "string" && info.fullName.trim().length > 0) {
      return info.fullName.trim();
    }

    if (typeof info.name === "string" && info.name.trim().length > 0) {
      return info.name.trim();
    }
  }

  return "Untitled Resume";
}

// ============================================================

function getResumeDescription(resume: Record<string, unknown>): string | undefined {
  if (typeof resume.description === "string" && resume.description.trim().length > 0) {
    return resume.description.trim();
  }

  return undefined;
}

// ============================================================

function getResumeTemplateId(resume: Record<string, unknown>): string {
  /**
   * This is your UNIQUE TEMPLATE ID.
   *
   * Example:
   *
   * tpl_7f3k9x2m
   *
   * It is stored in:
   *
   * Resume.resumeTemplateId
   */
  const templateId = resume.templateId;

  if (typeof templateId !== "string" || templateId.trim().length === 0) {
    throw new Error("Resume template ID is missing.");
  }

  return templateId.trim();
}

// ============================================================
// CREATE SAFEPAy CHECKOUT
// ============================================================

async function createSafepayCheckout({
  purchaseId,
  tracker,
  amount,
  currency,
}: {
  purchaseId: string;
  tracker: string;
  amount: number;
  currency: string;
}) {
  const safepay = createSafepayClient();

  // ----------------------------------------------------------
  // 1. Create Safepay tracker
  // ----------------------------------------------------------

  const trackerResponse = await safepay.payments.session.setup({
    intent: "CYBERSOURCE",
    mode: "payment",
    amount,
    currency,
  });

  const trackerToken =
    trackerResponse?.tracker?.token ??
    trackerResponse?.data?.tracker?.token ??
    trackerResponse?.data?.token ??
    null;

  if (typeof trackerToken !== "string" || trackerToken.length === 0) {
    console.error("[Safepay] Tracker response:", trackerResponse);

    throw new Error("Safepay did not return a tracker token.");
  }

  // ----------------------------------------------------------
  // 2. Save real Safepay tracker
  // ----------------------------------------------------------

  await prisma.resumePurchase.update({
    where: {
      id: purchaseId,
    },

    data: {
      tracker: trackerToken,
    },
  });

  // ----------------------------------------------------------
  // 3. Create Safepay authentication token
  // ----------------------------------------------------------

  const authResponse = await (safepay.auth as any).passport.create();

  const authToken =
    typeof authResponse?.data === "string"
      ? authResponse.data
      : typeof authResponse?.data?.token === "string"
        ? authResponse.data.token
        : null;

  if (typeof authToken !== "string" || authToken.length === 0) {
    console.error("[Safepay] Auth response:", authResponse);

    throw new Error("Safepay did not return an authentication token.");
  }

  // ----------------------------------------------------------
  // 4. Redirect URLs
  // ----------------------------------------------------------

  const successUrl =
    `${APP_URL}/app/payments/success` + `?purchaseId=${encodeURIComponent(purchaseId)}`;

  const cancelUrl =
    `${APP_URL}/app/payments/cancel` + `?purchaseId=${encodeURIComponent(purchaseId)}`;

  // ----------------------------------------------------------
  // 5. Create hosted checkout
  // ----------------------------------------------------------

  const checkoutResponse = await safepay.checkout.payment.create({
    tracker: trackerToken,
    tbt: authToken,
    environment: "sandbox",
    source: "hosted",
    redirect_url: successUrl,
    cancel_url: cancelUrl,
  });

  // ----------------------------------------------------------
  // 6. Extract checkout URL
  // ----------------------------------------------------------

  const checkoutUrl =
    typeof checkoutResponse === "string"
      ? checkoutResponse
      : (checkoutResponse?.data?.url ??
        checkoutResponse?.data?.redirect_url ??
        checkoutResponse?.url ??
        checkoutResponse?.redirect_url ??
        null);

  if (typeof checkoutUrl !== "string" || checkoutUrl.length === 0) {
    console.error("[Safepay] Checkout response:", checkoutResponse);

    throw new Error("Safepay did not return a checkout URL.");
  }

  return {
    checkoutUrl,
    trackerToken,
  };
}

// ============================================================
// POST
// ============================================================

export async function POST(request: Request) {
  try {
    // ========================================================
    // 1. AUTHENTICATION
    // ========================================================

    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return Response.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        {
          status: 401,
        },
      );
    }

    // ========================================================
    // 2. PARSE REQUEST
    // ========================================================

    let body: CreatePaymentRequest;

    try {
      body = (await request.json()) as CreatePaymentRequest;
    } catch {
      return Response.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        {
          status: 400,
        },
      );
    }

    // ========================================================
    // 3. VALIDATE PRODUCT
    // ========================================================

    if (body.productType !== "RESUME" && body.productType !== "AI_OPTIMIZER") {
      return Response.json(
        {
          success: false,
          error: "Invalid product type.",
        },
        {
          status: 400,
        },
      );
    }

    const product = PRODUCTS[body.productType];

    // ========================================================
    // 4. FIND DATABASE USER
    // ========================================================

    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUserId,
      },

      select: {
        id: true,
      },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          error: "Your account is not available yet. Please refresh and try again.",
        },
        {
          status: 404,
        },
      );
    }

    // ========================================================
    // 5. NORMAL RESUME PAYMENT
    // ========================================================

    if (body.productType === "RESUME") {
      // ------------------------------------------------------
      // Validate Prisma Resume.id
      // ------------------------------------------------------

      if (typeof body.resumeId !== "string" || body.resumeId.trim().length === 0) {
        return Response.json(
          {
            success: false,
            error:
              "This resume has not been saved yet. Please save the resume before purchasing the PDF.",
          },
          {
            status: 400,
          },
        );
      }

      const resumeId = body.resumeId.trim();

      // ------------------------------------------------------
      // Validate latest resume content
      // ------------------------------------------------------

      if (!body.resume || typeof body.resume !== "object" || Array.isArray(body.resume)) {
        return Response.json(
          {
            success: false,
            error: "Resume data is required.",
          },
          {
            status: 400,
          },
        );
      }

      // ------------------------------------------------------
      // IMPORTANT SECURITY CHECK
      //
      // The resume must belong to the authenticated user.
      // ------------------------------------------------------

      const existingResume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: user.id,
        },

        select: {
          id: true,
        },
      });

      if (!existingResume) {
        return Response.json(
          {
            success: false,
            error: "Resume not found. Please save the resume first.",
          },
          {
            status: 404,
          },
        );
      }

      // ------------------------------------------------------
      // Extract resume information
      // ------------------------------------------------------

      const resumeTemplateId = getResumeTemplateId(body.resume);

      const resumeName = getResumeName(body.resume);

      const resumeDescription = getResumeDescription(body.resume);

      // ------------------------------------------------------
      // SAVE LATEST RESUME FIRST
      //
      // This happens BEFORE payment creation.
      // ------------------------------------------------------

      await prisma.resume.update({
        where: {
          id: existingResume.id,
        },

        data: {
          name: resumeName,

          description: resumeDescription,

          /**
           * Your unique template identifier.
           *
           * Example:
           *
           * tpl_7f3k9x2m
           */
          resumeTemplateId,

          /**
           * Complete latest resume state.
           */
          content: body.resume as any,
        },
      });

      // ------------------------------------------------------
      // FIND EXISTING PENDING PURCHASE
      // ------------------------------------------------------

      let purchase = await prisma.resumePurchase.findFirst({
        where: {
          userId: user.id,

          resumeId: existingResume.id,

          productType: "RESUME",

          status: "PENDING",
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      // ------------------------------------------------------
      // CREATE PURCHASE
      // ------------------------------------------------------

      if (!purchase) {
        purchase = await prisma.resumePurchase.create({
          data: {
            userId: user.id,

            resumeId: existingResume.id,

            productType: "RESUME",

            provider: "safepay",

            /**
             * Temporary unique value.
             *
             * It will be replaced with the real
             * Safepay tracker immediately after
             * tracker creation.
             */
            tracker: `pending_${crypto.randomUUID()}`,

            amount: product.amount,

            currency: product.currency,

            status: "PENDING",
          },
        });
      }

      // ------------------------------------------------------
      // CREATE SAFEPAy CHECKOUT
      // ------------------------------------------------------

      const { checkoutUrl, trackerToken } = await createSafepayCheckout({
        purchaseId: purchase.id,

        tracker: purchase.tracker,

        amount: product.amount,

        currency: product.currency,
      });

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      return Response.json({
        success: true,

        /**
         * Prisma Resume.id
         */
        resumeId: existingResume.id,

        /**
         * Prisma ResumePurchase.id
         */
        purchaseId: purchase.id,

        /**
         * Safepay checkout URL
         */
        checkoutUrl,

        /**
         * Real Safepay tracker
         */
        tracker: trackerToken,

        productType: purchase.productType,

        amount: purchase.amount,

        currency: purchase.currency,
      });
    }

    // ========================================================
    // 6. AI RESUME OPTIMIZER PAYMENT
    // ========================================================

    if (body.productType === "AI_OPTIMIZER") {
      // ------------------------------------------------------
      // Validate optimizer ID
      // ------------------------------------------------------

      if (
        typeof body.resumeAIOptimizerId !== "string" ||
        body.resumeAIOptimizerId.trim().length === 0
      ) {
        return Response.json(
          {
            success: false,
            error: "resumeAIOptimizerId is required.",
          },
          {
            status: 400,
          },
        );
      }

      const optimizerId = body.resumeAIOptimizerId.trim();

      // ------------------------------------------------------
      // Verify ownership
      // ------------------------------------------------------

      const optimizer = await prisma.resumeAIOptimizer.findFirst({
        where: {
          id: optimizerId,

          userId: user.id,
        },

        select: {
          id: true,
        },
      });

      if (!optimizer) {
        return Response.json(
          {
            success: false,
            error: "AI optimizer resume not found.",
          },
          {
            status: 404,
          },
        );
      }

      // ------------------------------------------------------
      // FIND PENDING PURCHASE
      // ------------------------------------------------------

      let purchase = await prisma.resumePurchase.findFirst({
        where: {
          userId: user.id,

          resumeAIOptimizerId: optimizer.id,

          productType: "AI_OPTIMIZER",

          status: "PENDING",
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      // ------------------------------------------------------
      // CREATE PURCHASE
      // ------------------------------------------------------

      if (!purchase) {
        purchase = await prisma.resumePurchase.create({
          data: {
            userId: user.id,

            resumeAIOptimizerId: optimizer.id,

            productType: "AI_OPTIMIZER",

            provider: "safepay",

            tracker: `pending_${crypto.randomUUID()}`,

            amount: product.amount,

            currency: product.currency,

            status: "PENDING",
          },
        });
      }

      // ------------------------------------------------------
      // CREATE SAFEPAy CHECKOUT
      // ------------------------------------------------------

      const { checkoutUrl, trackerToken } = await createSafepayCheckout({
        purchaseId: purchase.id,

        tracker: purchase.tracker,

        amount: product.amount,

        currency: product.currency,
      });

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      return Response.json({
        success: true,

        purchaseId: purchase.id,

        checkoutUrl,

        tracker: trackerToken,

        productType: purchase.productType,

        amount: purchase.amount,

        currency: purchase.currency,
      });
    }

    // ========================================================
    // 7. UNSUPPORTED PRODUCT
    // ========================================================

    return Response.json(
      {
        success: false,
        error: "Unsupported payment product.",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error("[Safepay Payment] Error:", error);

    return Response.json(
      {
        success: false,

        error: error instanceof Error ? error.message : "Unable to create Safepay payment.",
      },
      {
        status: 500,
      },
    );
  }
}
