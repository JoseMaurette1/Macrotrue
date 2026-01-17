"use client";

import { useEffect, useState } from "react";
import { useClerk, SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowRight, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AuthenticatedContent() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [hasGoal, setHasGoal] = useState<boolean | null>(null);

  useEffect(() => {
    const checkGoalAndRedirect = async () => {
      try {
        const response = await fetch("/api/goals");
        if (response.ok) {
          const data = await response.json();
          if (data.calorieGoal) {
            router.replace("/Food");
            return;
          }
        }
        setHasGoal(false);
      } catch (error) {
        console.error("Error checking goal:", error);
        setHasGoal(false);
      }
    };

    checkGoalAndRedirect();
  }, [router]);

  if (hasGoal === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/Home" className="text-xl font-bold">
            <span className="text-primary">Macro</span>
            <span className="text-foreground">true</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/Food" className="text-sm hover:text-primary">
              Food
            </Link>
            <Link href="/Workout" className="text-sm hover:text-primary">
              Workout
            </Link>
            <Link href="/History" className="text-sm hover:text-primary">
              History
            </Link>
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
            <p className="text-muted-foreground mb-8">
              Let&apos;s get you set up with your personalized meal plan.
            </p>

            <div className="bg-muted/50 rounded-lg p-8 mb-8">
              <Utensils className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">
                Set Your Calorie Goal
              </h2>
              <p className="text-muted-foreground mb-6">
                Tell us about yourself and we&apos;ll calculate your daily calorie
                needs.
              </p>

              <Button size="lg" onClick={() => router.push("/Calculator")}>
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <SignedIn>
      <AuthenticatedContent />
    </SignedIn>
  );
}
