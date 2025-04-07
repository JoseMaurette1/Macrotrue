"use client";

import React, { useEffect, useState } from "react";
import MealData from "../components/MealData";
import MemberHeader from "../components/MemberHeader";

const MAX_REFRESHES = 5;

const FoodPage = () => {
  const [calories, setCalories] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  useEffect(() => {
    const savedCount = localStorage.getItem("refreshCount");
    const savedCalories = localStorage.getItem("selectedCalories");

    setRefreshCount(savedCount ? parseInt(savedCount) : 0);
    setCalories(savedCalories ? parseInt(savedCalories) : null);
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
            <div className="p-4 bg-primary/10 rounded-lg">
              <span className="text-xl font-semibold">{calories} Calories</span>
            </div>
          </div>
        )}
        <MealData
          onRefresh={handleRefresh}
          refreshCount={refreshCount}
          maxRefreshes={MAX_REFRESHES}
        />
      </div>
    </>
  );
};

export default FoodPage;
