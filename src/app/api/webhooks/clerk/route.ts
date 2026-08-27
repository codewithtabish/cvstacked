import prisma from "@/lib/prisma-client";
import { WebhookEvent } from "@clerk/nextjs/server";

import { headers } from "next/headers";

import { Webhook } from "svix";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!webhookSecret) {
    console.error("[Clerk Webhook] Missing CLERK_WEBHOOK_SIGNING_SECRET");

    return new Response("Missing webhook secret", {
      status: 500,
    });
  }

  // ============================================================
  // GET SVIX HEADERS
  // ============================================================

  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("[Clerk Webhook] Missing Svix headers");

    return new Response("Missing Svix headers", {
      status: 400,
    });
  }

  // ============================================================
  // GET RAW WEBHOOK BODY
  // ============================================================

  const payload = await req.text();

  // ============================================================
  // VERIFY CLERK WEBHOOK
  // ============================================================

  const webhook = new Webhook(webhookSecret);

  let event: WebhookEvent;

  try {
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("[Clerk Webhook] Verification failed:", error);

    return new Response("Invalid webhook signature", {
      status: 400,
    });
  }

  // ============================================================
  // HANDLE EVENT
  // ============================================================

  try {
    switch (event.type) {
      // ========================================================
      // USER CREATED
      // ========================================================

      case "user.created": {
        const data = event.data;

        const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ").trim() || null;

        await prisma.user.upsert({
          where: {
            clerkId: data.id,
          },

          update: {
            fullName,
          },

          create: {
            clerkId: data.id,
            fullName,
          },
        });

        console.log("[Clerk Webhook] User created:", data.id);

        break;
      }

      // ========================================================
      // USER UPDATED
      // ========================================================

      case "user.updated": {
        const data = event.data;

        const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ").trim() || null;

        await prisma.user.updateMany({
          where: {
            clerkId: data.id,
          },

          data: {
            fullName,
          },
        });

        console.log("[Clerk Webhook] User updated:", data.id);

        break;
      }

      // ========================================================
      // USER DELETED
      // ========================================================

      case "user.deleted": {
        const data = event.data;

        if (data.id) {
          await prisma.user.deleteMany({
            where: {
              clerkId: data.id,
            },
          });

          console.log("[Clerk Webhook] User deleted:", data.id);
        }

        break;
      }

      // ========================================================
      // IGNORE OTHER EVENTS
      // ========================================================

      default: {
        console.log("[Clerk Webhook] Ignored event:", event.type);

        break;
      }
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("[Clerk Webhook] Database error:", error);

    return new Response("Webhook processing failed", {
      status: 500,
    });
  }
}
