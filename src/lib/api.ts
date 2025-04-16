import { supabase } from "@/lib/supabase";
import { ensureAuthSession, getCurrentUserId } from "@/lib/auth";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type WorkoutType = "upper" | "lower" | "other";

export type Set = {
  weight: number;
  reps: number;
  completed?: boolean;
};

export type Exercise = {
  name: string;
  sets: Set[];
  restTimerDuration?: number;
  restTimerRunning?: boolean;
  restTimerStartTime?: number | null;
  restTimerElapsedTime?: number;
};

export type Workout = Exercise[];

export interface WorkoutEntry {
  id?: string;
  date: string;
  exercises: Exercise[];
  workoutType: WorkoutType;
}

// Database interfaces
interface WorkoutRecord {
  id: string;
  created_at: string;
  name: string;
  user_id: string;
  workout_type: WorkoutType;
  metadata?: any;
}

interface ExerciseRecord {
  id: string;
  created_at: string;
  name: string;
  sets: any;
  rest_timer_duration?: number;
  workout_id: string;
}

/**
 * Save a workout to Supabase
 */
export const saveWorkoutToSupabase = async (
  workoutType: WorkoutType,
  exercises: Workout
): Promise<boolean> => {
  try {
    // Check if Supabase client is initialized
    if (!supabase) {
      console.warn("Supabase client not initialized, cannot save workout");
      return false;
    }

    // Ensure we have a user session
    const userId = await ensureAuthSession();

    // First create the workout record
    const { data: workoutData, error: workoutError } = await supabase
      .from("workouts")
      .insert({
        name: `${
          workoutType.charAt(0).toUpperCase() + workoutType.slice(1)
        } Workout`,
        user_id: userId,
        workout_type: workoutType,
        metadata: {
          created_at_client: new Date().toISOString(),
        },
      })
      .select("id")
      .single();

    if (workoutError || !workoutData) {
      console.error("Error saving workout:", workoutError);
      return false;
    }

    // Now create exercise records for each exercise
    const exerciseRecords = exercises.map((exercise) => ({
      name: exercise.name,
      workout_id: workoutData.id,
      sets: exercise.sets,
      rest_timer_duration: exercise.restTimerDuration,
    }));

    const { error: exercisesError } = await supabase
      .from("exercises")
      .insert(exerciseRecords);

    if (exercisesError) {
      console.error("Error saving exercises:", exercisesError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in saveWorkoutToSupabase:", error);
    return false;
  }
};

/**
 * Get workout history from Supabase
 */
export const getWorkoutHistory = async (
  workoutType: WorkoutType
): Promise<WorkoutEntry[]> => {
  try {
    // Check if Supabase client is initialized
    if (!supabase) {
      console.warn(
        "Supabase client not initialized, cannot get workout history"
      );
      return [];
    }

    const userId = await getCurrentUserId();

    if (!userId) {
      return [];
    }

    // First get all workouts of the specified type
    const { data: workouts, error: workoutsError } = await supabase
      .from("workouts")
      .select("id, created_at, name")
      .eq("user_id", userId)
      .eq("workout_type", workoutType)
      .order("created_at", { ascending: false });

    if (workoutsError || !workouts) {
      console.error("Error fetching workouts:", workoutsError);
      return [];
    }

    // Now get all exercises for these workouts
    const workoutHistory: WorkoutEntry[] = [];

    for (const workout of workouts as WorkoutRecord[]) {
      const { data: exercises, error: exercisesError } = await supabase
        .from("exercises")
        .select("name, sets, rest_timer_duration")
        .eq("workout_id", workout.id);

      if (exercisesError) {
        console.error("Error fetching exercises:", exercisesError);
        continue;
      }

      // Format the data to match the WorkoutEntry interface
      workoutHistory.push({
        id: workout.id,
        date: workout.created_at,
        workoutType,
        exercises: exercises
          ? (exercises as ExerciseRecord[]).map((ex) => ({
              name: ex.name,
              sets: Array.isArray(ex.sets) ? ex.sets : [],
              restTimerDuration: ex.rest_timer_duration,
            }))
          : [],
      });
    }

    return workoutHistory;
  } catch (error) {
    console.error("Error in getWorkoutHistory:", error);
    return [];
  }
};

/**
 * Delete workout history for a specific type
 */
export const clearWorkoutHistory = async (
  workoutType: WorkoutType
): Promise<boolean> => {
  try {
    // Check if Supabase client is initialized
    if (!supabase) {
      console.warn(
        "Supabase client not initialized, cannot clear workout history"
      );
      return false;
    }

    const userId = await getCurrentUserId();

    if (!userId) {
      return false;
    }

    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("user_id", userId)
      .eq("workout_type", workoutType);

    if (error) {
      console.error("Error clearing workout history:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in clearWorkoutHistory:", error);
    return false;
  }
};