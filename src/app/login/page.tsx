"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { motion } from "framer-motion";
import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState("");

  // OAuth sign in handlers
  const handleOAuthSignIn = async (
    provider: "oauth_google" | "oauth_github"
  ) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/Home",
      });
    } catch (err: unknown) {
      console.error("OAuth error:", err);
      setError("Failed to authenticate with provider");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative hidden w-1/2 p-8 lg:block"
      >
        <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-[#2563eb] via-[#2563eb] to-[#2563eb]">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-semibold">Macrotrue</h1>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-4xl font-bold"
            >
              Welcome Back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12 text-lg"
            >
              Log in to continue tracking your fitness journey.
            </motion.p>

            <div className="w-full max-w-sm space-y-4">
              {[1, 2, 3].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`rounded-lg ${
                    step === 1 ? "bg-white/10" : "bg-white/5"
                  } p-4 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        step === 1
                          ? "bg-white text-black"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {step}
                    </span>
                    <span className="text-lg">
                      {step === 1 && "Access your account"}
                      {step === 2 && "Track your progress"}
                      {step === 3 && "Achieve your goals"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full items-center justify-center bg-background p-6 lg:w-1/2"
      >
        <div className="w-full max-w-md rounded-[40px] p-12">
          <div className="mx-auto max-w-sm">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-3xl font-bold text-foreground"
            >
              Log In Account
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 text-gray-400"
            >
              Enter your credentials to access your account.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 grid gap-4"
            >
              <Button
                variant="outline"
                className="h-12"
                onClick={() => handleOAuthSignIn("oauth_google")}
                disabled={isLoading || !isLoaded}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="h-12"
                onClick={() => handleOAuthSignIn("oauth_github")}
                disabled={isLoading || !isLoaded}
              >
                <Github className="mr-2 h-5 w-5" />
                Github
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
