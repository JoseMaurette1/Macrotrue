import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Clerk CSP headers required for OAuth
const clerkCspHeaders = {
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://*.clerk.com",
    "https://*.clerkjs.com",
    "https://*.clerk.accounts.dev",
  ],
  "script-src-elem": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://*.clerk.com",
    "https://*.clerkjs.com",
    "https://*.clerk.accounts.dev",
  ],
  "frame-src": [
    "'self'",
    "https://*.clerk.com",
  ],
  "connect-src": [
    "'self'",
    "https://*.clerk.com",
    "https://*.clerkjs.com",
    "https://*.clerk.accounts.dev",
  ],
  "worker-src": ["'self'", "blob:"],
  "img-src": ["'self'", "data:", "https:"],
  "style-src": ["'self'", "'unsafe-inline'"],
};

const buildCspHeader = (): string => {
  const directives: string[] = [];
  for (const [directive, values] of Object.entries(clerkCspHeaders)) {
    directives.push(`${directive} ${values.join(" ")}`);
  }
  return directives.join("; ");
};

const addCspHeaders = (response: NextResponse): NextResponse => {
  response.headers.set("Content-Security-Policy", buildCspHeader());
  return response;
};

export default clerkMiddleware(() => {
  const response = NextResponse.next();
  addCspHeaders(response);
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|static|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
