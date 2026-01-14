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
              sets: [...exercise.sets, { weight: 0, reps: 0 }],
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
              sets: exercise.sets.filter((_, j) => j !== setIndex),
            }
          : exercise
      );

      localStorage.setItem(`${type}Workout`, JSON.stringify(updatedWorkout));
      return updatedWorkout;
    });
  };

  const formatTime = (ms: number, duration: number) => {
    const remainingTime = Math.max(0, duration * 1000 - ms);
    const totalSeconds = Math.ceil(remainingTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {workout.map((exercise, exerciseIndex) => (
        <Card key={exercise.name} className="overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                {exercise.name}
              </CardTitle>
              <div className="flex items-center gap-4">
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
                <div className="flex items-center gap-2">
                  <Timer
                    className={
                      exercise.restTimerRunning
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  />
                  <span className="font-mono text-sm">
                    {formatTime(
                      exercise.restTimerElapsedTime || 0,
                      exercise.restTimerDuration || 60
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Sets Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/20 text-sm font-medium text-muted-foreground border-b">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4 text-center">Weight (lbs)</div>
              <div className="col-span-4 text-center">Reps</div>
              <div className="col-span-3 text-center">Done</div>
            </div>

            {/* Sets Rows */}
            {exercise.sets.map((set, setIndex) => (
              <div
                key={setIndex}
                className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center hover:bg-muted/10 transition-colors"
              >
                <div className="col-span-1 text-center text-muted-foreground font-medium">
                  {setIndex + 1}
                </div>
                <div className="col-span-4">
                  <Input
                    id={`weight-${exerciseIndex}-${setIndex}`}
                    type="number"
                    value={set.weight === 0 ? "" : set.weight?.toString()}
                    placeholder="0"
                    onChange={(e) => {
                      const newValue = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleUpdateSet(exerciseIndex, setIndex, "weight", newValue);
                    }}
                    className="text-center"
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    id={`reps-${exerciseIndex}-${setIndex}`}
                    type="number"
                    value={set.reps === 0 ? "" : set.reps?.toString()}
                    placeholder="0"
                    onChange={(e) => {
                      const newValue = e.target.value
                        ? parseInt(e.target.value, 10)
                        : 0;
                      handleUpdateSet(exerciseIndex, setIndex, "reps", newValue);
                    }}
                    className="text-center"
                  />
                </div>
                <div className="col-span-3 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSetCompletion(exerciseIndex, setIndex)}
                    className="hover:bg-transparent"
                  >
                    {set.completed ? (
                      <CheckCircle className="text-green-500 w-6 h-6" />
                    ) : (
                      <CheckCircle className="text-muted-foreground/40 w-6 h-6" />
                    )}
                  </Button>
                </div>
              </div>
            ))}

            {/* Add/Remove Buttons */}
            <div className="flex gap-3 p-4 bg-muted/10">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleAddSet(exerciseIndex)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Set
              </Button>
              {exercise.sets.length > 1 && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    handleRemoveSet(exerciseIndex, exercise.sets.length - 1)
                  }
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Remove Set
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutExercises;
