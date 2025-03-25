"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SSOCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AuthenticateWithRedirectCallback
        redirectUrl="/Home"
        afterSignInUrl="/Home"
        afterSignUpUrl="/Home"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-primary mx-auto"></div>
        <h2 className="mb-2 text-2xl font-semibold text-foreground">
          Completing authentication...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we complete your authentication.
        </p>
      </motion.div>
    </div>
  );
}