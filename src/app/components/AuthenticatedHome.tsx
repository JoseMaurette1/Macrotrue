"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Header from "./Header";
import MemberHeader from "./MemberHeader";
import Hero from "./Hero";
import Features from "./Features";
import Pricing from "./Pricing";
import Questions from "./Questions";
import CTA from "./CTA";
import Footer from "./Footer";
import CalorieCalculator from "./CalorieCalculator";
import { ArrowRight, Utensils } from "lucide-react";
import AuthenticatedHomePage from "@/components/ui/AuthenticatedHome";

export default function AuthenticatedHome() {
  const { user, isLoaded } = useUser();
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
      <MemberHeader />
	    <AuthenticatedHomePage title="Your journey starts here"/>
      <Footer />
    </>
  );
}
