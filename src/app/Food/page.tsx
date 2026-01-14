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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await fetch("/api/goals");
        if (response.ok) {
          const data = await response.json();
          if (data.calorieGoal) {
            setCalories(data.calorieGoal);
            setTargetCalories(data.calorieGoal);
          }
        }
      } catch (error) {
        console.error("Failed to fetch calorie goal:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoal();
  }, []);

  const handleRefresh = () => {
    if (refreshCount < MAX_REFRESHES) {
      setRefreshCount((prevCount) => prevCount + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <MemberHeader />
      </div>
    );
  }

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
          </div>
        )}
        {!calories && (
          <Card className="mb-6">
            <CardContent className="pt-4">
              <p className="text-amber-500">
                Please set your calorie goal in the{" "}
                <a href="/Calculator" className="underline">
                  Calculator
                </a>{" "}
                first.
              </p>
            </CardContent>
          </Card>
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
