"use client";
import { useState, useEffect } from "react";
import WorkoutTypeButtons from "@/app/components/WorkoutTypeButtons";
import WorkoutCard from "./WorkoutCard";
import SaveWorkoutButton from "@/app/components/SaveWorkoutButton";
import { upperWorkoutTemplate } from "@/app/components/Upper";
import { lowerWorkoutTemplate } from "@/app/components/Lower";
import { OtherWorkoutTemplate } from "@/app/components/Other";
import MemberHeader from "@/app/components/MemberHeader";

type WorkoutType = "upper" | "lower" | "other";

type Set = {
  weight: number;
  reps: number;
  completed?: boolean;
};

type Exercise = {
  name: string;
  sets: Set[];
  restTimerDuration?: number; // Duration in seconds
  restTimerRunning?: boolean;
  restTimerStartTime?: number | null;
  restTimerElapsedTime?: number;
};

type Workout = Exercise[];

export default function WorkoutForm() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  const [upperWorkout, setUpperWorkout] = useState<Workout>([]);
  const [lowerWorkout, setLowerWorkout] = useState<Workout>([]);
  const [otherWorkout, setOtherWorkout] = useState<Workout>([]);

  useEffect(() => {
    const loadWorkout = (type: WorkoutType): Workout => {
      const storedWorkout = localStorage.getItem(`${type}Workout`);
      const parsedWorkout = storedWorkout
        ? (JSON.parse(storedWorkout) as Workout)
        : type === "upper"
          ? upperWorkoutTemplate
          : type === "lower"
            ? lowerWorkoutTemplate
            : OtherWorkoutTemplate;

      // Initialize rest timer properties for each exercise
      return parsedWorkout.map((exercise) => ({
        ...exercise,
        restTimerDuration: exercise.restTimerDuration ?? 60, // Default to 60 seconds
        restTimerRunning: exercise.restTimerRunning ?? false,
        restTimerStartTime: exercise.restTimerStartTime ?? null,
        restTimerElapsedTime: exercise.restTimerElapsedTime ?? 0,
      }));
    };

    setUpperWorkout(loadWorkout("upper"));
    setLowerWorkout(loadWorkout("lower"));
    setOtherWorkout(loadWorkout("other"));
  }, []);

  useEffect(() => {
    const tick = () => {
      setUpperWorkout((prevWorkout) => updateTimers(prevWorkout));
      setLowerWorkout((prevWorkout) => updateTimers(prevWorkout));
      setOtherWorkout((prevWorkout) => updateTimers(prevWorkout));
    };

    const intervalId = setInterval(tick, 10); // Update every 10 ms

    return () => clearInterval(intervalId);
  }, []);

  const updateTimers = (workout: Workout): Workout => {
    return workout.map((exercise) => {
      if (exercise.restTimerRunning && exercise.restTimerStartTime) {
        const elapsedTime = Date.now() - exercise.restTimerStartTime;
        if (elapsedTime >= (exercise.restTimerDuration || 60) * 1000) {
          // Timer finished
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
      <div className="container mx-auto px-4 py-8 mt-6">
        <WorkoutTypeButtons
          workoutType={workoutType}
          setWorkoutType={setWorkoutType}
        />

        {workoutType && (
          <WorkoutCard
            workoutType={workoutType}
            upperWorkout={upperWorkout}
            lowerWorkout={lowerWorkout}
            otherWorkout={otherWorkout}
            setUpperWorkout={setUpperWorkout}
            setLowerWorkout={setLowerWorkout}
            setOtherWorkout={setOtherWorkout}
          />
        )}
        {workoutType && (
          <SaveWorkoutButton
            workoutType={workoutType}
            upperWorkout={upperWorkout}
            lowerWorkout={lowerWorkout}
            otherWorkout={otherWorkout}
          />
        )}
      </div>
    </>
  );
}
