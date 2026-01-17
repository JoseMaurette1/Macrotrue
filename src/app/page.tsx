import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { Activity, Utensils } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <SignedOut>
        <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Macrotrue
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mb-12">
            AI-powered meal planning and workout tracking to help you reach your fitness goals.
          </p>
          
          <div className="flex gap-4 mb-16">
            <SignInButton mode="modal">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-6 py-3 border rounded-md font-medium hover:bg-accent transition-colors">
                Get Started
              </button>
            </SignUpButton>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div className="p-6 rounded-xl border bg-card">
              <Utensils className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">AI Meal Planning</h3>
              <p className="text-muted-foreground">
                Get personalized meal recommendations based on your calorie goals using Groq AI.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <Activity className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Workout Tracking</h3>
              <p className="text-muted-foreground">
                Track your upper and lower body workouts with built-in timers and history.
              </p>
            </div>
          </div>
        </section>
      </SignedOut>

      <SignedIn>
        <RedirectToSignIn />
      </SignedIn>
    </div>
  );
}
