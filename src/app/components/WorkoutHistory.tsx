"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  getWorkoutHistory,
  clearWorkoutHistory,
  WorkoutEntry,
  WorkoutType,
} from "@/lib/api";

import { toast } from "sonner";

export default function WorkoutHistory() {
  const [upperWorkoutHistory, setUpperWorkoutHistory] = useState<
    WorkoutEntry[]
  >([]);
  const [lowerWorkoutHistory, setLowerWorkoutHistory] = useState<
    WorkoutEntry[]
  >([]);
  const [otherWorkoutHistory, setOtherWorkoutHistory] = useState<
    WorkoutEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState<WorkoutType | null>(null);

  const loadWorkoutHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const [upper, lower, other] = await Promise.all([
        getWorkoutHistory("upper"),
        getWorkoutHistory("lower"),
        getWorkoutHistory("other"),
      ]);

      setUpperWorkoutHistory(upper);
      setLowerWorkoutHistory(lower);
      setOtherWorkoutHistory(other);
    } catch (error) {
      console.error("Error loading workout history:", error);
      toast.error("Failed to load workout history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkoutHistory();
  }, [loadWorkoutHistory]);

  const clearHistory = async (type: WorkoutType) => {
    try {
      setIsClearing(type);

      await clearWorkoutHistory(type);

      if (type === "upper") {
        setUpperWorkoutHistory([]);
      } else if (type === "lower") {
        setLowerWorkoutHistory([]);
      } else if (type === "other") {
        setOtherWorkoutHistory([]);
      }

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)
        } workout history cleared`
      );
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear workout history");
    } finally {
      setIsClearing(null);
    }
  };

  const renderWorkout = (
    workoutHistory: WorkoutEntry[],
    title: string,
    type: WorkoutType
  ) => (
    <Card className="mb-4">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <Button
          onClick={() => clearHistory(type)}
          disabled={isClearing === type}
        >
          {isClearing === type ? "Clearing..." : "Clear History"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
              <p className="mt-2">Loading workouts...</p>
            </div>
          </div>
        ) : workoutHistory.length > 0 ? (
          workoutHistory.map((entry: WorkoutEntry, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700">
                {new Date(entry.date).toLocaleDateString()}
              </h3>
              {entry.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="mb-4">
                  <h2 className="text-lg font-semibold">{exercise.name}</h2>
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex items-center space-x-4">
                      <span>Set {setIndex + 1}:</span>
                      <span>{set.weight} lbs |</span>
                      <span>{set.reps} reps</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Link href={"/Workout"}>
          <ArrowLeft className="mr-2" />
        </Link>
        Workout History
      </h1>
      {renderWorkout(upperWorkoutHistory, "Upper Workout History", "upper")}
      {renderWorkout(lowerWorkoutHistory, "Lower Workout History", "lower")}
      {renderWorkout(otherWorkoutHistory, "Other Workout History", "other")}
    </div>
  );
}
