"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Meal {
  name: string;
  portions: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface MealDataProps {
  onRefresh: () => void;
  refreshCount: number;
  maxRefreshes: number;
  targetCalories?: number | null;
}

interface AIMealResponse {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const MealData = ({
  onRefresh,
  refreshCount,
  maxRefreshes,
  targetCalories,
}: MealDataProps) => {
  const [aiMeals, setAiMeals] = useState<AIMealResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      setError(null);

      if (!targetCalories || targetCalories < 1000) {
        setError("Please set a calorie goal in the Calculator first");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/meal-recommendations?calories=${targetCalories}`
        );

        if (!response.ok) {
          throw new Error("Failed to generate meals");
        }

        const data = await response.json();
        if (data.breakfast && data.lunch && data.dinner) {
          setAiMeals(data);
        } else {
          throw new Error("Invalid response from meal generator");
        }
      } catch (err) {
        console.error("Failed to fetch AI meals:", err);
        setError("Failed to generate meals. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [targetCalories]);

  const handleRefresh = async () => {
    if (!targetCalories || targetCalories < 1000) return;

    onRefresh();
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/meal-recommendations?calories=${targetCalories}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.breakfast && data.lunch && data.dinner) {
          setAiMeals(data);
        }
      }
    } catch (err) {
      console.error("Failed to refresh meals:", err);
      setError("Failed to refresh meals. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isRefreshDisabled = refreshCount >= maxRefreshes;

  const refreshButtonTitle = isRefreshDisabled
    ? "Upgrade to premium or pro to refresh more than 5 times"
    : `${maxRefreshes - refreshCount} refreshes remaining`;

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <p>Generating personalized meals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 flex flex-col justify-center items-center space-y-4">
        <p className="text-red-500">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!aiMeals) {
    return (
      <div className="container py-8 flex flex-col justify-center items-center space-y-4">
        <p className="text-amber-500">No meals available</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary text-white"
        >
          Refresh
        </Button>
      </div>
    );
  }

  const renderMealCard = (category: string, meal: Meal) => {
    if (!meal) return null;

    return (
      <div key={category} className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight capitalize">
          {category}
          <span className="text-sm ml-2 font-normal text-muted-foreground">
            {meal.macros.calories} cal
          </span>
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
      {renderMealCard("breakfast", aiMeals.breakfast)}
      {renderMealCard("lunch", aiMeals.lunch)}
      {renderMealCard("dinner", aiMeals.dinner)}

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
