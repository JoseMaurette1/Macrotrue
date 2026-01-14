"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import MemberHeader from "@/app/components/MemberHeader";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading && !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mb-8">
          Thank you for subscribing to Macrotrue! Your account has been
          upgraded and you now have access to all premium features.
        </p>
        <div className="space-y-4">
          <Link href="/Home">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <Link href="/Pricing">
            <Button variant="outline" className="w-full">
              View Your Plan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      <Suspense
        fallback={
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
