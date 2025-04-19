"use client";

import React, { useEffect, useState } from "react";
import MealData from "../components/MealData";
import MemberHeader from "../components/MemberHeader";
import { Card, CardContent } from "@/components/ui/card";

const MAX_REFRESHES = 5;

const FoodPage = () => {
  const [calories, setCalories] = useState<number | null>(null);
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  useEffect(() => {
    const savedCount = localStorage.getItem("refreshCount");
    const savedCalories = localStorage.getItem("selectedCalories");
    const savedTargetCalories = localStorage.getItem("targetCalories");

    setRefreshCount(savedCount ? parseInt(savedCount) : 0);
    setCalories(savedCalories ? parseInt(savedCalories) : null);
    setTargetCalories(
      savedTargetCalories ? parseInt(savedTargetCalories) : null
    );
  }, []);

  const handleRefresh = () => {
    if (refreshCount < MAX_REFRESHES) {
      setRefreshCount((prevCount) => {
        const newCount = prevCount + 1;
        localStorage.setItem("refreshCount", newCount.toString());
        return newCount;
      });
    }
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <MemberHeader />
      </div>
      <div className="container mx-auto p-6">
        {calories && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Daily Calorie Goal</h2>
            <div className="p-4 bg-primary/10 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xl font-semibold">{calories} Calories</span>
            </div>

            {targetCalories && targetCalories !== calories && (
              <Card className="mt-3 bg-green-50 dark:bg-green-900/20">
                <CardContent className="pt-4">
                  <p className="text-sm">
                    Your portions will be adjusted to meet your target of{" "}
                    <strong>{targetCalories} calories</strong> per day.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        <MealData
          onRefresh={handleRefresh}
          refreshCount={refreshCount}
          maxRefreshes={MAX_REFRESHES}
          targetCalories={targetCalories}
        />
      </div>
    </>
  );
};

export default FoodPage;
