"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Payment Cancelled</h1>
        <p className="text-muted-foreground">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        <div className="pt-4">
          <Link href="/Pricing">
            <Button variant="outline" size="lg">
              Back to Pricing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
