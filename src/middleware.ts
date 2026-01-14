import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes - these routes require authentication
const protectedPaths = [
  // Ensure exact paths with trailing slashes for directories
  "/Home",
  "/Home/",
  "/Workout",
  "/Workout/",
  "/Calculator",
  "/Calculator/",
  "/Food",
  "/Food/",
  "/History",
  "/History/",
];

// Future implementation: premium routes
// const premiumPaths = ["/Workout", "/Workout/"];

// Create a route matcher for protected paths
// Use exact matching with trailing slashes to catch all variations
const isProtectedRoute = createRouteMatcher([
  ...protectedPaths,
  ...protectedPaths.map((path) => `${path}/(.*)`),
  ...protectedPaths.map((path) => `${path}(.*)`),
]);

// Create middleware that handles auth
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute(req) && !userId) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|static|.*\\..*|api).*)",
    // Also must match all API routes
    "/api/(.*)",
  ],
};
