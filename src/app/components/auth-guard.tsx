"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";

type AuthGuardProps = {
  children: React.ReactNode;
};

// Grace period to allow Clerk session to establish after OAuth redirect
const AUTH_GRACE_PERIOD_MS = 2000;

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

    if (!isLoaded) {
      // Still loading Clerk
      setIsCheckingAuth(true);
      return;
    }

    if (userId || isSignedIn) {
      // User is authenticated
      setIsCheckingAuth(false);
      return;
    }

    // Clerk says loaded but no user - wait a bit before redirecting
    redirectTimeoutRef.current = setTimeout(() => {
      if (!userId && !isSignedIn) {
        console.log(
          "AuthGuard: User not authenticated after grace period, redirecting to login"
        );
        router.replace("/login");
      }
      setIsCheckingAuth(false);
    }, AUTH_GRACE_PERIOD_MS);

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [isLoaded, userId, isSignedIn, router]);

  // Show loading state while Clerk is loading or during auth check grace period
  if (!isLoaded || isCheckingAuth) {
    return <Loader variant="classic" />;
  }

  // If authenticated, show the children
  return userId ? <>{children}</> : null;
}
