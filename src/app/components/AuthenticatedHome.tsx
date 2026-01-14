"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import Pricing from "./Pricing";
import Questions from "./Questions";
import CTA from "./CTA";
import Footer from "./Footer";
import CalorieCalculator from "./CalorieCalculator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils } from "lucide-react";

export default function AuthenticatedHome() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [hasGoal, setHasGoal] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const checkGoalAndRedirect = async () => {
      if (!user) {
        // Not signed in - show public home
        setHasGoal(false);
        return;
      }

      try {
        const response = await fetch("/api/goals");
        if (response.ok) {
          const data = await response.json();
          if (data.calorieGoal) {
            // Has goal - redirect to Food
            router.replace("/Food");
            return;
          }
        }
        // No goal - show setup flow
        setHasGoal(false);
      } catch (error) {
        console.error("Error checking goal:", error);
        setHasGoal(false);
      }
    };

    checkGoalAndRedirect();
  }, [user, isLoaded, router]);

  if (!isLoaded || hasGoal === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Public home page
    return (
      <>
        <Header />
        <Hero />
        <div>
          <CalorieCalculator />
        </div>
        <Features />
        <Pricing />
        <Questions />
        <CTA />
        <Footer />
      </>
    );
  }

  // User is signed in but has no goal - show setup CTA
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold">
            <span className="text-primary">Macro</span>
            <span className="text-foreground">true</span>
          </span>
          <Button variant="ghost" onClick={() => signOut()}>
            Sign Out
          </Button>
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

      <Footer />
    </>
  );
}
