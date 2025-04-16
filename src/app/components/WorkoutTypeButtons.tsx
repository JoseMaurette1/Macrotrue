"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type WorkoutType = "upper" | "lower" | "other";

interface WorkoutTypeButtonsProps {
  workoutType: WorkoutType | null;
  setWorkoutType: (type: WorkoutType | null) => void;
}

const WorkoutTypeButtons: React.FC<WorkoutTypeButtonsProps> = ({
  workoutType,
  setWorkoutType,
}) => {
  return (
    <div className="flex justify-center space-x-4 mb-8 flex-wrap">
      <Button
        onClick={() => setWorkoutType("upper")}
        variant={workoutType === "upper" ? "default" : "outline"}
      >
        Upper Workout
      </Button>
      <Button
        onClick={() => setWorkoutType("lower")}
        variant={workoutType === "lower" ? "default" : "outline"}
      >
        Lower Workout
      </Button>
      <Button
        onClick={() => setWorkoutType("other")}
        variant={workoutType === "other" ? "default" : "outline"}
        className="mt-2 sm:mt-0 md:mt-0"
      >
        Other Workout
      </Button>
    </div>
  );
};

export default WorkoutTypeButtons;