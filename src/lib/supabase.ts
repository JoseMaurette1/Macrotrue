import { createClient } from "@supabase/supabase-js";

// Try multiple sources for environment variables as a fallback mechanism
const getEnvVar = (name: string, fallback: string): string => {
  // First try process.env
  if (process.env[name]) {
    return process.env[name] as string;
  }

  // Then try window.__ENV__ which might be injected by the custom server
  if (
    typeof window !== "undefined" &&
    window &&
    // @ts-expect-error - custom property
    window.__ENV__ &&
    // @ts-expect-error - custom property
    window.__ENV__[name]
  ) {
    // @ts-expect-error - custom property
    return window.__ENV__[name];
  }

  // Finally use hardcoded fallback
  return fallback;
};

// Provide fallback values in case nothing else works
const FALLBACK_URL = "https://ohdogbczynddtogdjbhg.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZG9nYmN6eW5kZHRvZ2RqYmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzQ2NjUsImV4cCI6MjA1OTcxMDY2NX0.wAEecwxkoITczVw5_rdaZwCjjP8RDirxkBzrXyk6W-s";

// Get environment variables with fallbacks
const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL", FALLBACK_URL);
const supabaseAnonKey = getEnvVar(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  FALLBACK_KEY
);

let supabase: ReturnType<typeof createClient> | null = null;

try {
  // Create the Supabase client (will throw if URL or key are invalid)
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true, // Enable session persistence
      autoRefreshToken: true, // Auto-refresh tokens
      detectSessionInUrl: true, // Detect session from URL
    },
  });

  // Test if client is working by making a simple query
  if (typeof window !== "undefined") {
    // Only run this client-side check in the browser
    supabase
      .from("workouts")
      .select("count", { count: "exact", head: true })
      .then(() => {
        console.log("Supabase client initialized successfully");
      }, (err) => {
        // This handles errors because .catch() is not available on PromiseLike<void>
        console.warn("Warning: Supabase connection test failed", err);
      });
  }
} catch (error) {
  // Handle client initialization errors
  console.error("Error initializing Supabase client:", error);

  if (typeof window !== "undefined") {
    // Redirect to fallback page if in browser
    if (window.location.pathname !== "/fallback.html") {
      console.warn(
        "Redirecting to fallback page due to Supabase initialization error"
      );
      // Don't redirect during development to avoid infinite loops
      if (process.env.NODE_ENV !== "development") {
        window.location.href = "/fallback.html";
      }
    }
  }
}

export { supabase };

// Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      workouts: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          user_id?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          sets: number;
          reps: number;
          weight: number;
          workout_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          sets: number;
          reps: number;
          weight: number;
          workout_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          sets?: number;
          reps?: number;
          weight?: number;
          workout_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}