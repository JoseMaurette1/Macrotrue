"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import MemberHeader from "@/app/components/MemberHeader";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <XCircle className="h-20 w-20 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Cancelled
          </h1>
          <p className="text-muted-foreground mb-8">
            Your payment was cancelled. No charges were made to your account.
            You can try again whenever you&apos;re ready.
          </p>
          <div className="space-y-4">
            <Link href="/Pricing">
              <Button className="w-full">Try Again</Button>
            </Link>
            <Link href="/Home">
              <Button variant="outline" className="w-full">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
