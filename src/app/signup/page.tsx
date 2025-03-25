"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { motion } from "framer-motion";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClerkError } from "../types/clerk";

export default function SignUpPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError("");

      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/Home");
      } else {
        // Handle other status cases
        if (result.status === "missing_requirements") {
          // Redirect to verification page if required
          router.push("/verify");
        } else {
          console.error("Sign up failed", result);
          setError("Something went wrong. Please try again.");
        }
      }
    } catch (err: unknown) {
      console.error("Error during sign up:", err);
      const clerkError = err as ClerkError;
      setError(
        clerkError.errors?.[0]?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (
    provider: "oauth_google" | "oauth_github"
  ) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signUp.authenticateWithRedirect({
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
              Get Started with Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12 text-lg"
            >
              Complete these easy steps to register your account.
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
                      {step === 1 && "Create your account"}
                      {step === 2 && "Figure out your calorie needs"}
                      {step === 3 && "Start Reaching Your Goals"}
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
              Sign Up Account
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 text-gray-400"
            >
              Enter your personal data to create your account.
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
                onClick={() => handleOAuthSignUp("oauth_google")}
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
                onClick={() => handleOAuthSignUp("oauth_github")}
                disabled={isLoading || !isLoaded}
              >
                <Github className="mr-2 h-5 w-5" />
                Github
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 text-sm text-red-500"
              >
                {error}
              </motion.div>
            )}

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div id="clerk-captcha"></div>
              <div className="space-y-2">
                <Input
                  className="h-12 border-input bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="example1234@gmail.com"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading || !isLoaded}
                  required
                />
              </div>

              <div className="space-y-2">
                <Input
                  className="h-12 border-input bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="********"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading || !isLoaded}
                  required
                />
                <p className="text-sm text-gray-400">
                  Must be at least 8 characters.
                </p>
              </div>

              <Button
                type="submit"
                className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || !isLoaded}
              >
                {isLoading ? "Loading..." : "Sign Up"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/login" className="text-foreground hover:underline">
                  Log in
                </a>
              </p>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
