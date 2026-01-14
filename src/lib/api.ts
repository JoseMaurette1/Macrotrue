import { getCurrentUserId } from "@/lib/auth";

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

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};

const getStorageKey = (workoutType: WorkoutType, userId: string): string => {
  return `${workoutType}WorkoutHistory_${userId}`;
};

export const saveWorkoutToStorage = async (
  workoutType: WorkoutType,
  exercises: Workout
): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    const storageKey = getStorageKey(workoutType, userId);
    
    const existingData = safeLocalStorage.getItem(storageKey);
    const existingWorkouts: WorkoutEntry[] = existingData 
      ? JSON.parse(existingData) 
      : [];
    
    const newEntry: WorkoutEntry = {
      id: `workout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString(),
      exercises,
      workoutType,
    };
    
    existingWorkouts.unshift(newEntry);
    
    safeLocalStorage.setItem(storageKey, JSON.stringify(existingWorkouts));
    
    return true;
  } catch (error) {
    console.error("Error in saveWorkoutToStorage:", error);
    return false;
  }
};

export const getWorkoutHistory = async (
  workoutType: WorkoutType
): Promise<WorkoutEntry[]> => {
  try {
    const userId = await getCurrentUserId();
    const storageKey = getStorageKey(workoutType, userId);
    
    const legacyKey = `${workoutType}WorkoutHistory`;
    const legacyData = safeLocalStorage.getItem(legacyKey);
    
    const newData = safeLocalStorage.getItem(storageKey);
    
    let workouts: WorkoutEntry[] = [];
    
    if (newData) {
      workouts = JSON.parse(newData);
    }
    
    if (legacyData) {
      const legacyWorkouts = JSON.parse(legacyData);
      const formattedLegacy = legacyWorkouts.map((entry: Record<string, unknown>) => ({
        id: entry.id || `legacy_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        date: entry.date as string,
        exercises: entry.exercises as Exercise[],
        workoutType,
      }));
      
      workouts = [...workouts, ...formattedLegacy];
    }
    
    return workouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error in getWorkoutHistory:", error);
    return [];
  }
};

export const clearWorkoutHistory = async (
  workoutType: WorkoutType
): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    const storageKey = getStorageKey(workoutType, userId);
    
    safeLocalStorage.removeItem(storageKey);
    
    const legacyKey = `${workoutType}WorkoutHistory`;
    safeLocalStorage.removeItem(legacyKey);
    
    return true;
  } catch (error) {
    console.error("Error in clearWorkoutHistory:", error);
    return false;
  }
};

export const saveWorkoutToSupabase = saveWorkoutToStorage;
