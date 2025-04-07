"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MealCategory, Meal, MealIndexes } from "@/app/types/meals";
import {
  fetchMealData,
  generateRandomMealIndexes,
} from "@/app/utils/mealUtils";

interface MealDataProps {
  onRefresh: () => void;
  refreshCount: number;
  maxRefreshes: number;
}

const MealData = ({ onRefresh, refreshCount, maxRefreshes }: MealDataProps) => {
  const [mealData, setMealData] = useState<MealCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mealIndexes, setMealIndexes] = useState<MealIndexes>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  // Fetch meal data from JSON file
  useEffect(() => {
    const getMealData = async () => {
      try {
        const data = await fetchMealData();
        setMealData(data);
        setIsLoading(false);
      } catch {
        setError("Failed to load meal data. Please try again later.");
        setIsLoading(false);
      }
    };

    getMealData();
  }, []);

  // Generate random meal indexes on initial load
  useEffect(() => {
    if (mealData) {
      setMealIndexes(generateRandomMealIndexes(mealData));
    }
  }, [mealData]);

  const handleRefresh = () => {
    if (!mealData) return;
    setMealIndexes(generateRandomMealIndexes(mealData));
    onRefresh();
  };

  const isRefreshDisabled = refreshCount >= maxRefreshes;

  const refreshButtonTitle = isRefreshDisabled
    ? "Upgrade to premium or pro to refresh more than 5 times"
    : `${maxRefreshes - refreshCount} refreshes remaining`;

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <p>Loading meal data...</p>
      </div>
    );
  }

  if (error || !mealData) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <p className="text-red-500">{error || "Failed to load meal data"}</p>
      </div>
    );
  }

  const renderMealCard = (category: string, meals: Meal[]) => {
    const meal = meals[mealIndexes[category as keyof MealIndexes]];
    return (
      <div key={category} className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight capitalize">
          {category}
        </h2>
        <div className="grid gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>{meal.name}</CardTitle>
              <p className="text-sm">{meal.portions}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Calories:</span>
                  <span>{meal.macros.calories}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Protein:</span>
                  <span>{meal.macros.protein}g</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Carbs:</span>
                  <span>{meal.macros.carbs}g</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Fat:</span>
                  <span>{meal.macros.fat}g</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-8 space-y-8"
    >
      {Object.entries(mealData).map(([category, meals]) =>
        renderMealCard(category, meals as Meal[])
      )}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <Button
          onClick={
            isRefreshDisabled
              ? () => (window.location.href = "/pricing")
              : handleRefresh
          }
          title={refreshButtonTitle}
          className={`${
            isRefreshDisabled ? "bg-gray-500" : "bg-primary"
          } text-white`}
          aria-label={
            isRefreshDisabled ? "Upgrade for More Refreshes" : "Refresh Meals"
          }
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (isRefreshDisabled) {
                window.location.href = "/pricing";
              } else {
                handleRefresh();
              }
            }
          }}
        >
          {isRefreshDisabled
            ? "Upgrade for More Refreshes"
            : `Refresh Meals (${maxRefreshes - refreshCount} left)`}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default MealData;
