"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkoutExercises from "./WorkoutExercises";

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

interface WorkoutCardProps {
  workoutType: WorkoutType;
  upperWorkout: Workout;
  lowerWorkout: Workout;
  otherWorkout: Workout;
  setUpperWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  setLowerWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  setOtherWorkout: React.Dispatch<React.SetStateAction<Workout>>;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workoutType,
  upperWorkout,
  lowerWorkout,
  otherWorkout,
  setUpperWorkout,
  setLowerWorkout,
  setOtherWorkout,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          {workoutType === "upper"
            ? "Upper Workout"
            : workoutType === "lower"
              ? "Lower Workout"
              : "Other Workout"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {workoutType === "upper" && (
          <WorkoutExercises
            workout={upperWorkout}
            setWorkout={setUpperWorkout}
            type="upper"
          />
        )}
        {workoutType === "lower" && (
          <WorkoutExercises
            workout={lowerWorkout}
            setWorkout={setLowerWorkout}
            type="lower"
          />
        )}
        {workoutType === "other" && (
          <WorkoutExercises
            workout={otherWorkout}
            setWorkout={setOtherWorkout}
            type="other"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;