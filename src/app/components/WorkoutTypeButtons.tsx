"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type WorkoutType = "upper" | "lower" | null;

interface WorkoutTypeButtonsProps {
  workoutType: WorkoutType;
  setWorkoutType: (type: WorkoutType) => void;
}

const WorkoutTypeButtons: React.FC<WorkoutTypeButtonsProps> = ({
  workoutType,
  setWorkoutType,
}) => {
  const routines = [
    {
      type: "upper" as const,
      name: "Upper Body",
      icon: Dumbbell,
      description: "Chest, back, shoulders, arms",
    },
    {
      type: "lower" as const,
      name: "Lower Body",
      icon: Dumbbell,
      description: "Legs, glutes, core",
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Routines</h2>
      <div className="flex flex-col gap-4">
        {routines.map((routine, index) => {
          const Icon = routine.icon;
          const isSelected = workoutType === routine.type;

          return (
            <motion.div
              key={routine.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                onClick={() => setWorkoutType(routine.type)}
                className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon size={24} />
                      </div>
                      <h3 className="text-xl font-semibold">{routine.name}</h3>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                      >
                        <ArrowRight size={16} className="text-primary-foreground" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-muted-foreground">{routine.description}</p>
                </div>
                <div className="px-6 pb-4">
                  <Button
                    className={`w-full ${
                      isSelected ? "" : "bg-secondary hover:bg-secondary/80 text-foreground"
                    }`}
                    variant={isSelected ? "default" : "secondary"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setWorkoutType(routine.type);
                    }}
                  >
                    {isSelected ? "In Progress" : "Start Routine"}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutTypeButtons;
