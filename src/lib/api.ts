export type WorkoutType = "upper" | "lower";

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

export const saveWorkout = async (
  workoutType: WorkoutType,
  exercises: Workout
): Promise<boolean> => {
  try {
    const response = await fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workoutType, exercises }),
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = `HTTP ${response.status}`;

      try {
        const error = JSON.parse(text);
        console.error("API error:", error);
        if (error && typeof error === "object" && "error" in error) {
          const message = (error as { error?: string }).error;
          if (message) errorMessage = message;
        }
      } catch {
        if (text) {
          errorMessage = text;
        }
        console.error("API error:", errorMessage);
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error saving workout:", error);
    return false;
  }
};

export const getWorkoutHistory = async (
  workoutType?: WorkoutType
): Promise<WorkoutEntry[]> => {
  try {
    const url = workoutType
      ? `/api/workouts?type=${workoutType}`
      : "/api/workouts";

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch workouts");
      return [];
    }

    const data = await response.json();

    return data.workouts.map(
      (w: { id: string; createdAt: string; exercises: Exercise[]; workoutType: WorkoutType }) => ({
        id: w.id,
        date: w.createdAt,
        exercises: w.exercises as Exercise[],
        workoutType: w.workoutType as WorkoutType,
      })
    );
  } catch (error) {
    console.error("Error in getWorkoutHistory:", error);
    return [];
  }
};

export const clearWorkoutHistory = async (
  workoutType: WorkoutType
): Promise<boolean> => {
  void workoutType;
  console.warn("clearWorkoutHistory not implemented for database");
  return false;
};
