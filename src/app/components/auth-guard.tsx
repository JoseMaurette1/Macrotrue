"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      console.log("AuthGuard: User not authenticated, redirecting to login");
      router.replace("/login");
    } else if (isLoaded && userId) {
      console.log("AuthGuard: User authenticated, allowing access");
    }
  }, [isLoaded, userId, router]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return <Loader variant="classic" />;
  }

  // If authenticated or still loading, show the children
  return userId ? <>{children}</> : null;
}
