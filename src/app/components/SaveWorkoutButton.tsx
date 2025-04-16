// components/SaveWorkoutButton.tsx
"use client";

import React, { useState } from "react";
import { Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveWorkoutToSupabase, Workout, WorkoutType } from "@/lib/api";


interface SaveWorkoutButtonProps {
  workoutType: WorkoutType | null;
  upperWorkout: Workout;
  lowerWorkout: Workout;
  otherWorkout: Workout;
}

const SaveWorkoutButton: React.FC<SaveWorkoutButtonProps> = ({
  workoutType,
  upperWorkout,
  lowerWorkout,
  otherWorkout,
}) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Function to save to both localStorage (for backward compatibility) and Supabase
  const saveWorkout = async (data: Workout) => {
    if (!workoutType) return;

    // For backward compatibility, still save to localStorage
    const savedWorkouts: { date: string; exercises: Workout }[] = JSON.parse(
      localStorage.getItem(`${workoutType}WorkoutHistory`) || "[]"
    );

    const workoutWithDate = {
      date: new Date().toISOString(),
      exercises: data,
    };

    savedWorkouts.push(workoutWithDate);
    localStorage.setItem(
      `${workoutType}WorkoutHistory`,
      JSON.stringify(savedWorkouts)
    );

    // Save to Supabase
    try {
      setIsSaving(true);
      const success = await saveWorkoutToSupabase(workoutType, data);
      if (!success) {
        toast.error(
          "Failed to save workout to the database. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("An error occurred while saving your workout.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex space-x-4 justify-center mt-6">
      <Button
        className="w-24"
        disabled={isSaving || !workoutType}
        onClick={async () => {
          if (!workoutType) return;

          await saveWorkout(
            workoutType === "upper"
              ? upperWorkout
              : workoutType === "lower"
                ? lowerWorkout
                : otherWorkout
          );

          toast.success("Workout Has Been Saved", {
            action: {
              label: "Go",
              onClick: () => {
                toast("Routing to History...", { duration: 10 });
                router.push("/History");
              },
            },
          });
        }}
      >
        {isSaving ? "Saving..." : "Save"} {!isSaving && <Download />}
      </Button>
      <Link href={"/History"}>
        <Button>
          Workout History <History />
        </Button>
      </Link>
    </div>
  );
};

export default SaveWorkoutButton;