"use client";

import React, { useEffect, useState } from "react";
import MealData from "../components/MealData";
import MemberHeader from "../components/MemberHeader";

const FoodPage = () => {
  const [calories, setCalories] = useState<number | null>(null);

  useEffect(() => {
    const savedCalories = localStorage.getItem("selectedCalories");
    setCalories(savedCalories ? parseInt(savedCalories) : null);
  }, []);

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
      </div>
    </>
  );
};

export default FoodPage;
