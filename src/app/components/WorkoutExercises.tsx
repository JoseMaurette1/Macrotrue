"use client";

import React from "react";
import { CheckCircle, Timer, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface WorkoutExercisesProps {
  workout: Workout;
  setWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  type: WorkoutType;
}

const restOptions = [30, 60, 90, 120, 150, 180];

const WorkoutExercises: React.FC<WorkoutExercisesProps> = ({
  workout,
  setWorkout,
  type,
}) => {
  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    key: keyof Set,
    value: number
  ) => {
    setWorkout((prevWorkout) => {
      const updatedWorkout = prevWorkout.map((exercise, i) =>
        i === exerciseIndex
          ? {
            ...exercise,
            sets: exercise.sets.map((set, j) =>
              j === setIndex ? { ...set, [key]: value } : set
            ),
          }
          : exercise
      );

      localStorage.setItem(`${type}Workout`, JSON.stringify(updatedWorkout));
      return updatedWorkout;
    });
  };

  const handleSetCompletion = (exerciseIndex: number, setIndex: number) => {
    setWorkout((prevWorkout) => {
      const updatedWorkout = prevWorkout.map((exercise, i) => {
        if (i === exerciseIndex) {
          const updatedSets = exercise.sets.map((set, j) =>
            j === setIndex ? { ...set, completed: !set.completed } : set
          );

          // Start timer when set is completed
          const updatedExercise = {
            ...exercise,
            sets: updatedSets,
            restTimerRunning: true,
            restTimerStartTime: Date.now(),
            restTimerElapsedTime: 0,
          };
          return updatedExercise;
        } else {
          return exercise;
        }
      });

      localStorage.setItem(`${type}Workout`, JSON.stringify(updatedWorkout));
      return updatedWorkout;
    });
  };

  const handleRestTimerSelect = (exerciseIndex: number, duration: number) => {
    setWorkout((prevWorkout) => {
      const updatedWorkout = prevWorkout.map((exercise, i) =>
        i === exerciseIndex
          ? {
            ...exercise,
            restTimerDuration: duration,
          }
          : exercise
      );

      localStorage.setItem(`${type}Workout`, JSON.stringify(updatedWorkout));
      return updatedWorkout;
    });
  };

  const handleAddSet = (exerciseIndex: number) => {
    setWorkout((prevWorkout) => {
      const updatedWorkout = prevWorkout.map((exercise, i) =>
        i === exerciseIndex
          ? {
            ...exercise,
            sets: [...exercise.sets, { weight: 0, reps: 0 }], // Add a new set with default values
          }
          : exercise
      );

      localStorage.setItem(`${type}Workout`, JSON.stringify(updatedWorkout));
      return updatedWorkout;
    });
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    setWorkout((prevWorkout) => {
      const updatedWorkout = prevWorkout.map((exercise, i) =>
        i === exerciseIndex
          ? {
            ...exercise,
            sets: exercise.sets.filter((_, j) => j !== setIndex), // Remove the set at setIndex
          }
          : exercise
      );

      localStorage.setItem(`${type}Workout`, JSON.stringify(updatedWorkout));
      return updatedWorkout;
    });
  };

  const formatTime = (ms: number, duration: number) => {
    const remainingTime = Math.max(0, duration * 1000 - ms); // Calculate remaining time
    const totalSeconds = Math.ceil(remainingTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return workout.map((exercise, exerciseIndex) => (
    <Card key={exercise.name} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {exercise.name}
          </CardTitle>
          <div className="sm:flex sm:flex-col sm:items-end space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Rest: {exercise.restTimerDuration}s
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {restOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => handleRestTimerSelect(exerciseIndex, option)}
                  >
                    {option} seconds
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center">
              <Timer
                className={
                  exercise.restTimerRunning ? "text-green-500" : "text-gray-500"
                }
              />
              <span>
                {formatTime(
                  exercise.restTimerElapsedTime || 0,
                  exercise.restTimerDuration || 60
                )}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className="flex items-center space-x-2 mb-2">
            <div className="flex flex-col">
              <label
                htmlFor={`weight-${exerciseIndex}-${setIndex}`}
                className="text-sm text-gray-600"
              >
                Lbs
              </label>
              <Input
                id={`weight-${exerciseIndex}-${setIndex}`}
                type="number"
                value={set.weight === 0 ? "" : set.weight?.toString()}
                placeholder={set.weight === 0 ? "0" : ""}
                onChange={(e) => {
                  const newValue = e.target.value
                    ? parseFloat(e.target.value)
                    : 0;
                  handleUpdateSet(exerciseIndex, setIndex, "weight", newValue);
                }}
                className="w-20"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor={`reps-${exerciseIndex}-${setIndex}`}
                className="text-sm text-gray-600"
              >
                Reps
              </label>
              <Input
                id={`reps-${exerciseIndex}-${setIndex}`}
                type="number"
                value={set.reps === 0 ? "" : set.reps?.toString()}
                placeholder={set.reps === 0 ? "0" : ""}
                onChange={(e) => {
                  const newValue = e.target.value
                    ? parseInt(e.target.value, 10)
                    : 0;
                  handleUpdateSet(exerciseIndex, setIndex, "reps", newValue);
                }}
                className="w-20"
              />
            </div>

            <span className="text-sm text-gray-500">Set {setIndex + 1}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSetCompletion(exerciseIndex, setIndex)}
            >
              {set.completed ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <CheckCircle className="text-gray-300" />
              )}
            </Button>
          </div>
        ))}
        <div className="flex flex-col w-full">
          <Button
            variant="outline"
            className="w-full mb-2"
            onClick={() => handleAddSet(exerciseIndex)}
          >
            Add
            <Plus className="" />
          </Button>
          {exercise.sets.length > 1 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                handleRemoveSet(exerciseIndex, exercise.sets.length - 1)
              }
            >
              Remove
              <Minus className="" />
            </Button>
          )}
        </div>{" "}
      </CardContent>
    </Card>
  ));
};

export default WorkoutExercises;