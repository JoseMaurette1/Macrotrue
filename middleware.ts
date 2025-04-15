import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes - these routes require authentication
// Make sure the paths exactly match your directory structure
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
];

// Future implementation: premium routes
const premiumPaths = ["/Workout", "/Workout/"];

// Create a route matcher for protected paths
// Use exact matching with trailing slashes to catch all variations
const isProtectedRoute = createRouteMatcher([
  ...protectedPaths,
  // Also match any subdirectories
  ...protectedPaths.map((path) => `${path}/(.*)`),
  ...protectedPaths.map((path) => `${path}(.*)`),
]);

// For debugging: Output to console
console.log("Protected routes configured:", protectedPaths);

// Create middleware that handles auth
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const path = req.nextUrl.pathname;

  // Debug logging
  console.log(
    `Middleware checking: ${path}, userId: ${
      userId ? "authenticated" : "not authenticated"
    }`
  );
  console.log(`Is protected route: ${isProtectedRoute(req) ? "yes" : "no"}`);

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute(req) && !userId) {
    console.log(`Redirecting unauthenticated user from ${path} to login`);
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Future implementation: Premium route check
  /*
  const isPremiumRoute = createRouteMatcher([
    ...premiumPaths,
    // Also match any subdirectories
    ...premiumPaths.map(path => `${path}/(.*)`),
    ...premiumPaths.map(path => `${path}(.*)`)
  ]);

  const { user } = await auth();
  if (userId && isPremiumRoute(req) && !user?.publicMetadata?.isPremium) {
    const pricingUrl = new URL('/Pricing', req.url);
    return NextResponse.redirect(pricingUrl);
  }
  */

  console.log(`Allowing access to ${path}`);
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
