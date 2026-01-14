"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MealCategory, Meal, MealIndexes } from "@/app/types/meals";
import {
  fetchMealData,
  generateRandomMealIndexes,
  calculateAdjustedMeal,
} from "@/app/utils/mealUtils";

interface MealDataProps {
  onRefresh: () => void;
  refreshCount: number;
  maxRefreshes: number;
  targetCalories?: number | null;
}

const MealData = ({
  onRefresh,
  refreshCount,
  maxRefreshes,
  targetCalories,
}: MealDataProps) => {
  const [mealData, setMealData] = useState<MealCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mealIndexes, setMealIndexes] = useState<MealIndexes>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  useEffect(() => {
    const getMealData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMealData();
        
        if (data && Object.values(data).some((arr) => arr.length > 0)) {
          setMealData(data);
        } else {
          setMealData({
            breakfast: [],
            lunch: [],
            dinner: [],
          });
        }
      } catch (fetchError) {
        console.error("Failed to fetch meal data:", fetchError);
        setError("Failed to load meal data");
        setMealData({
          breakfast: [],
          lunch: [],
          dinner: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    getMealData();
  }, []);

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
      <div className="container py-8 flex flex-col justify-center items-center space-y-4">
        <p className="text-red-500">{error || "Failed to load meal data"}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary text-white"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  const hasAnyMeals = Object.values(mealData).some(
    (category) => category.length > 0
  );

  if (!hasAnyMeals) {
    return (
      <div className="container py-8 flex flex-col justify-center items-center space-y-4">
        <p className="text-amber-500">
          No meal data available. Please check back later.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary text-white"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  const getCaloriesPerMeal = () => {
    if (!targetCalories) return null;
    return Math.round(targetCalories / 3);
  };

  const caloriesPerMeal = getCaloriesPerMeal();

  const renderMealCard = (category: string, meals: Meal[]) => {
    if (meals.length === 0) return null;

    const mealIndex = mealIndexes[category as keyof MealIndexes];
    const safeIndex = meals.length > 0 ? mealIndex % meals.length : 0;
    let meal = meals[safeIndex];

    if (caloriesPerMeal && meal) {
      meal = calculateAdjustedMeal(meal, caloriesPerMeal);
    }

    return (
      <div key={category} className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight capitalize">
          {category}
          {caloriesPerMeal && (
            <span className="text-sm ml-2 font-normal text-muted-foreground">
              Target: {caloriesPerMeal} cal
            </span>
          )}
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
              ? () => (window.location.href = "/Pricing")
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
