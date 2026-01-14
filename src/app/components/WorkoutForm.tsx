"use client";
import { useState, useEffect } from "react";
import WorkoutTypeButtons from "@/app/components/WorkoutTypeButtons";
import WorkoutCard from "./WorkoutCard";
import SaveWorkoutButton from "@/app/components/SaveWorkoutButton";
import { upperWorkoutTemplate } from "@/app/components/Upper";
import { lowerWorkoutTemplate } from "@/app/components/Lower";
import MemberHeader from "@/app/components/MemberHeader";

type WorkoutType = "upper" | "lower";

type Set = {
  weight: number;
  reps: number;
  completed?: boolean;
};

type Exercise = {
  name: string;
  sets: Set[];
  restTimerDuration?: number;
  restTimerRunning?: boolean;
  restTimerStartTime?: number | null;
  restTimerElapsedTime?: number;
};

type Workout = Exercise[];

export default function WorkoutForm() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  const [upperWorkout, setUpperWorkout] = useState<Workout>([]);
  const [lowerWorkout, setLowerWorkout] = useState<Workout>([]);

  useEffect(() => {
    const loadWorkout = (type: WorkoutType): Workout => {
      const storedWorkout = localStorage.getItem(`${type}Workout`);
      const template = type === "upper" ? upperWorkoutTemplate : lowerWorkoutTemplate;
      const parsedWorkout = storedWorkout ? (JSON.parse(storedWorkout) as Workout) : template;

      return parsedWorkout.map((exercise) => ({
        ...exercise,
        restTimerDuration: exercise.restTimerDuration ?? 60,
        restTimerRunning: exercise.restTimerRunning ?? false,
        restTimerStartTime: exercise.restTimerStartTime ?? null,
        restTimerElapsedTime: exercise.restTimerElapsedTime ?? 0,
      }));
    };

    setUpperWorkout(loadWorkout("upper"));
    setLowerWorkout(loadWorkout("lower"));
  }, []);

  useEffect(() => {
    const tick = () => {
      setUpperWorkout((prevWorkout) => updateTimers(prevWorkout));
      setLowerWorkout((prevWorkout) => updateTimers(prevWorkout));
    };

    const intervalId = setInterval(tick, 10);

    return () => clearInterval(intervalId);
  }, []);

  const updateTimers = (workout: Workout): Workout => {
    return workout.map((exercise) => {
      if (exercise.restTimerRunning && exercise.restTimerStartTime) {
        const elapsedTime = Date.now() - exercise.restTimerStartTime;
        if (elapsedTime >= (exercise.restTimerDuration || 60) * 1000) {
          return {
            ...exercise,
            restTimerRunning: false,
            restTimerElapsedTime: (exercise.restTimerDuration || 60) * 1000,
          };
        } else {
          return {
            ...exercise,
            restTimerElapsedTime: elapsedTime,
          };
        }
      }
      return exercise;
    });
  };

  return (
    <>
      <MemberHeader />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="lg:w-72 lg:flex-shrink-0 mb-6 lg:mb-0">
              <div className="lg:sticky lg:top-24">
                <WorkoutTypeButtons
                  workoutType={workoutType}
                  setWorkoutType={setWorkoutType}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {workoutType ? (
                <>
                  <WorkoutCard
                    workoutType={workoutType}
                    upperWorkout={upperWorkout}
                    lowerWorkout={lowerWorkout}
                    setUpperWorkout={setUpperWorkout}
                    setLowerWorkout={setLowerWorkout}
                  />
                  <div className="mt-6">
                    <SaveWorkoutButton
                      workoutType={workoutType}
                      upperWorkout={upperWorkout}
                      lowerWorkout={lowerWorkout}
                    />
                  </div>
                </>
              ) : (
                <div className="hidden lg:flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-border">
                  <p className="text-muted-foreground">Select a routine to start your workout</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
