"use client";

import { useSignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ClerkError } from "../types/clerk";

export default function VerifyPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect if there's no pending verification
  useEffect(() => {
    if (isLoaded && !signUp) {
      router.push("/signup");
    }
  }, [isLoaded, signUp, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp) return;

    try {
      setIsSubmitting(true);
      setError("");

      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.error("Verification failed", result);
        setError("Verification failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Error during verification:", err);
      const clerkError = err as ClerkError;
      setError(clerkError.errors?.[0]?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setError("");
      // Show success message
      alert("Verification code resent to your email!");
    } catch (err: unknown) {
      console.error("Error resending code:", err);
      const clerkError = err as ClerkError;
      setError(clerkError.errors?.[0]?.message || "Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-[40px] p-12"
      >
        <div className="mx-auto max-w-sm">
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Verify your email
          </h2>
          <p className="mb-8 text-gray-400">
            We&apos;ve sent a verification code to your email address. Please enter it below.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-sm text-red-500"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Verification Code
                </label>
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-xs text-primary hover:underline"
                  disabled={isSubmitting}
                >
                  Resend code
                </button>
              </div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter 6-digit code"
                disabled={isSubmitting || !isLoaded}
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting || !isLoaded}
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Need help?{" "}
              <a href="mailto:support@macrotrue.com" className="text-foreground hover:underline">
                Contact support
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}