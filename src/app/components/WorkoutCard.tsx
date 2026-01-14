"use client";

import React from "react";
import WorkoutExercises from "./WorkoutExercises";
import { Exercise } from "@/lib/api";

type WorkoutType = "upper" | "lower";

interface WorkoutCardProps {
  workoutType: WorkoutType;
  upperWorkout: Exercise[];
  lowerWorkout: Exercise[];
  setUpperWorkout: React.Dispatch<React.SetStateAction<Exercise[]>>;
  setLowerWorkout: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workoutType,
  upperWorkout,
  lowerWorkout,
  setUpperWorkout,
  setLowerWorkout,
}) => {
  const title = workoutType === "upper" ? "Upper Body" : "Lower Body";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">Complete your workout by tracking each exercise</p>
      </div>
      <WorkoutExercises
        workout={workoutType === "upper" ? upperWorkout : lowerWorkout}
        setWorkout={workoutType === "upper" ? setUpperWorkout : setLowerWorkout}
        type={workoutType}
      />
    </div>
  );
};

export default WorkoutCard;
