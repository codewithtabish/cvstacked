"use server";

import prisma from "@/lib/prisma-client";
import { auth } from "@clerk/nextjs/server";

// ============================================================
// TYPES
// ============================================================

interface CreateResumeInput {
  name: string;
  description?: string | null;
  resumeTemplateId: string;
  content: any;
}

interface CreateResumeResult {
  success: boolean;
  resumeId?: string;
  error?: string;
}

// ============================================================
// CREATE RESUME
//
// Creates a brand-new Resume for the currently authenticated
// user.
//
// This action DOES NOT update existing resumes.
// ============================================================

export async function createResumeAction(input: CreateResumeInput): Promise<CreateResumeResult> {
  console.log("============================================================");
  console.log("[Create Resume] ACTION CALLED");
  console.log("============================================================");

  try {
    // ========================================================
    // 1. AUTHENTICATION
    // ========================================================

    console.log("[Create Resume] Step 1: Checking authentication...");

    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      console.error("[Create Resume] AUTH FAILED: No Clerk user ID found.");

      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    console.log("[Create Resume] AUTH SUCCESS:", {
      clerkUserId,
    });

    // ========================================================
    // 2. VALIDATE INPUT
    // ========================================================

    console.log("[Create Resume] Step 2: Validating input...");

    if (!input || typeof input !== "object") {
      console.error("[Create Resume] VALIDATION FAILED: Invalid resume data.");

      return {
        success: false,
        error: "Invalid resume data.",
      };
    }

    if (typeof input.name !== "string" || !input.name.trim()) {
      console.error("[Create Resume] VALIDATION FAILED: Resume name is missing.", {
        name: input.name,
      });

      return {
        success: false,
        error: "Resume name is required.",
      };
    }

    if (typeof input.resumeTemplateId !== "string" || !input.resumeTemplateId.trim()) {
      console.error("[Create Resume] VALIDATION FAILED: Resume template is missing.", {
        resumeTemplateId: input.resumeTemplateId,
      });

      return {
        success: false,
        error: "Resume template is required.",
      };
    }

    if (
      input.description !== undefined &&
      input.description !== null &&
      typeof input.description !== "string"
    ) {
      console.error("[Create Resume] VALIDATION FAILED: Invalid description.", {
        descriptionType: typeof input.description,
      });

      return {
        success: false,
        error: "Invalid resume description.",
      };
    }

    if (input.content === undefined || input.content === null) {
      console.error("[Create Resume] VALIDATION FAILED: Resume content is missing.");

      return {
        success: false,
        error: "Resume content is required.",
      };
    }

    console.log("[Create Resume] VALIDATION SUCCESS:", {
      name: input.name.trim(),
      description: input.description?.trim() || null,
      resumeTemplateId: input.resumeTemplateId.trim(),
      hasContent: true,
      contentType: typeof input.content,
    });

    // ========================================================
    // 3. FIND DATABASE USER
    // ========================================================

    console.log("[Create Resume] Step 3: Finding database user...");

    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUserId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      console.error("[Create Resume] USER LOOKUP FAILED: Database user not found.", {
        clerkUserId,
      });

      return {
        success: false,
        error: "Your account is not available yet. Please refresh and try again.",
      };
    }

    console.log("[Create Resume] DATABASE USER FOUND:", {
      userId: user.id,
    });

    // ========================================================
    // 4. CREATE NEW RESUME
    // ========================================================

    console.log("[Create Resume] Step 4: Creating new resume...");

    const createdResume = await prisma.resume.create({
      data: {
        userId: user.id,

        name: input.name.trim(),

        description: input.description?.trim() || null,

        resumeTemplateId: input.resumeTemplateId.trim(),

        content: input.content,
      },

      select: {
        id: true,
      },
    });

    // ========================================================
    // 5. SUCCESS
    // ========================================================

    console.log("[Create Resume] CREATE SUCCESS:", {
      resumeId: createdResume.id,
      userId: user.id,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      resumeTemplateId: input.resumeTemplateId.trim(),
    });

    console.log("[Create Resume] ACTION FINISHED SUCCESSFULLY.");

    return {
      success: true,
      resumeId: createdResume.id,
    };
  } catch (error) {
    // ========================================================
    // 6. ERROR
    // ========================================================

    console.error("============================================================");
    console.error("[Create Resume] ACTION FAILED");
    console.error("============================================================");

    console.error("[Create Resume] Error object:", error);

    if (error instanceof Error) {
      console.error("[Create Resume] Error name:", error.name);

      console.error("[Create Resume] Error message:", error.message);

      console.error("[Create Resume] Error stack:", error.stack);
    }

    console.error("============================================================");

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to create resume.",
    };
  }
}
