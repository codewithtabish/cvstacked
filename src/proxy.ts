import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAppRoute = createRouteMatcher(["/app(.*)"]);
const isHomeRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // User is not authenticated and tries to access /app
  if (!userId && isAppRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // User is authenticated and tries to access the landing page
  if (userId && isHomeRoute(req)) {
    return NextResponse.redirect(new URL("/app", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
