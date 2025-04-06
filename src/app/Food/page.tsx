"use client";

import React, { useEffect, useState } from "react";
import MealData from "../components/MealData";
import MemberHeader from "../components/MemberHeader";

const FoodPage = () => {
  const [calories, setCalories] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(() => {
    const savedCount = localStorage.getItem("refreshCount");
    return savedCount ? parseInt(savedCount) : 0;
  });

  useEffect(() => {
    const savedCalories = localStorage.getItem("selectedCalories");
    setCalories(savedCalories ? parseInt(savedCalories) : null);
  }, []);

  const handleRefresh = () => {
    if (refreshCount < 5) {
      // Logic to refresh meal data
      setRefreshCount((prevCount) => {
        const newCount = prevCount + 1;
        localStorage.setItem("refreshCount", newCount.toString());
        return newCount;
      });
    } else {
      alert("You have reached the maximum number of refreshes.");
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
        <MealData />
        <button onClick={handleRefresh} disabled={refreshCount >= 5} className="btn btn-primary">
          Refresh Meals
        </button>
      </div>
    </>
  );
};

export default FoodPage;
