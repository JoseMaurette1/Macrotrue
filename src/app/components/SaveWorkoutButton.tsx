"use client";

import React, { useState } from "react";
import { Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveWorkout as saveWorkoutToDb, Workout } from "@/lib/api";

type WorkoutType = "upper" | "lower";

interface SaveWorkoutButtonProps {
  workoutType: WorkoutType;
  upperWorkout: Workout;
  lowerWorkout: Workout;
}

const SaveWorkoutButton: React.FC<SaveWorkoutButtonProps> = ({
  workoutType,
  upperWorkout,
  lowerWorkout,
}) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveWorkout = async (data: Workout) => {
    try {
      setIsSaving(true);
      const success = await saveWorkoutToDb(workoutType, data);
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
          const workout = workoutType === "upper" ? upperWorkout : lowerWorkout;
          await handleSaveWorkout(workout);

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
