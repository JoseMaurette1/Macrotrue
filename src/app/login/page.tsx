"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full items-center justify-center bg-background p-6"
      >
        <div className="w-full max-w-md rounded-[40px] p-12">
          <div className="mx-auto max-w-sm">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-3xl font-bold text-foreground"
            >
              Login to <span className="text-[#0974f1]">Macrotrue</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 text-gray-400"
            >
              Welcome back! Please enter your details.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 grid gap-4"
            >
              <Button variant="outline" className="h-12">
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
              <Button variant="outline" className="h-12">
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
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Input
                  className="h-12 border-input bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="example1234@gmail.com"
                  type="email"
                />
              </div>

              <div className="space-y-2">
                <Input
                  className="h-12 border-input bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="********"
                  type="password"
                />
              </div>

              <Button className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Login
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="text-foreground hover:underline">
                  Sign up
                </a>
              </p>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
