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
const rawSupabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL", FALLBACK_URL);
const supabaseAnonKey = getEnvVar(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  FALLBACK_KEY
);

// Validate and format the Supabase URL
let supabaseUrl = rawSupabaseUrl;
if (!supabaseUrl.startsWith("https://") && !supabaseUrl.startsWith("http://")) {
  supabaseUrl = `https://${supabaseUrl}`;
}

// Validation flags
export const hasValidSupabaseUrl =
  supabaseUrl &&
  (supabaseUrl.includes(".supabase.co") || supabaseUrl.includes("localhost"));

export const hasValidSupabaseKey =
  supabaseAnonKey && supabaseAnonKey.length > 20;

export const hasValidSupabaseConfig =
  hasValidSupabaseUrl && hasValidSupabaseKey;

// Export configuration for logging
export const supabaseConfig = {
  url: hasValidSupabaseUrl ? supabaseUrl : null,
  hasKey: hasValidSupabaseKey,
  isConfigValid: hasValidSupabaseConfig,
};

// Create Supabase client conditionally
let supabaseClient = null;

try {
  if (hasValidSupabaseConfig) {
    console.log(
      "Initializing Supabase client with URL:",
      supabaseUrl.substring(0, 30) + "..."
    );
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Try with fallback values as a last resort
    console.warn("Invalid Supabase configuration, trying with fallback values");
    supabaseClient = createClient(FALLBACK_URL, FALLBACK_KEY);
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  // One last attempt with fallbacks
  try {
    supabaseClient = createClient(FALLBACK_URL, FALLBACK_KEY);
  } catch (finalError) {
    console.error(
      "Final attempt to create Supabase client failed:",
      finalError
    );
  }
}

export const supabase = supabaseClient;

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
