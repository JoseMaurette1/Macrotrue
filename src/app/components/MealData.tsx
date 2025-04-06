"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MealCategory, Meal, MealIndexes } from "@/app/types/meals";
import { fetchMealData, generateRandomMealIndexes } from "@/app/utils/mealUtils";

const MealData = () => {
  const [mealData, setMealData] = useState<MealCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mealIndexes, setMealIndexes] = useState<MealIndexes>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [refreshCount, setRefreshCount] = useState(0);

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

  const refreshMeals = () => {
    if (!mealData) return;

    // Ensure all three meal types are refreshed at once
    setMealIndexes(generateRandomMealIndexes(mealData));
    setRefreshCount((prevCount) => prevCount + 1);
  };

  const isRefreshDisabled = refreshCount >= 1;

  const refreshButtonTitle = isRefreshDisabled
    ? "Upgrade to premium or pro to refresh more than once"
    : "";

  const refreshButtonText = isRefreshDisabled
    ? "Upgrade for More Refreshes"
    : "Refresh Meals";

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
      <div className="flex justify-center">
        <Button
          onClick={refreshMeals}
          disabled={isRefreshDisabled}
          title={refreshButtonTitle}
        >
          {refreshButtonText}
        </Button>
      </div>
    </motion.div>
  );
};

export default MealData;
