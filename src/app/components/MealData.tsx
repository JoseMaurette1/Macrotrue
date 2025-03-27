"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  name: string;
  portions: string;
  macros: MacroNutrients;
}

interface MealCategory {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

export const mealData: MealCategory = {
  breakfast: [
    {
      name: "Eggs and Toast",
      portions: "3 large eggs (150g), 2 slices whole wheat bread (50g)",
      macros: {
        calories: 400,
        protein: 26,
        carbs: 30,
        fat: 22,
      },
    },
    {
      name: "Oatmeal with Protein Powder",
      portions: "1 cup dry oats (80g), 1 scoop protein powder (30g)",
      macros: {
        calories: 350,
        protein: 24,
        carbs: 42,
        fat: 8,
      },
    },
  ],
  lunch: [
    {
      name: "Chicken and Rice",
      portions: "6 oz chicken breast (170g), 1 cup cooked rice (185g)",
      macros: {
        calories: 450,
        protein: 45,
        carbs: 45,
        fat: 8,
      },
    },
    {
      name: "Turkey Wrap",
      portions: "6 oz turkey (170g), 1 large tortilla (60g)",
      macros: {
        calories: 400,
        protein: 40,
        carbs: 30,
        fat: 12,
      },
    },
  ],
  dinner: [
    {
      name: "Beef and Rice",
      portions: "6 oz lean beef (170g), 1 cup cooked rice (185g)",
      macros: {
        calories: 500,
        protein: 42,
        carbs: 45,
        fat: 15,
      },
    },
    {
      name: "Chicken and Sweet Potato",
      portions: "6 oz chicken breast (170g), 1 medium sweet potato (150g)",
      macros: {
        calories: 400,
        protein: 42,
        carbs: 35,
        fat: 8,
      },
    },
  ],
};

const MealData = () => {
  const [mealIndexes, setMealIndexes] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [refreshCount, setRefreshCount] = useState(0);
  const [userTier, setUserTier] = useState("basic"); // Default to basic tier

  // Generate random meal indexes on initial load
  useEffect(() => {
    const randomIndexes = {
      breakfast: Math.floor(Math.random() * mealData.breakfast.length),
      lunch: Math.floor(Math.random() * mealData.lunch.length),
      dinner: Math.floor(Math.random() * mealData.dinner.length),
    };
    setMealIndexes(randomIndexes);
  }, []);

  const refreshMeals = () => {
    // Ensure all three meal types are refreshed at once
    setMealIndexes({
      breakfast: Math.floor(Math.random() * mealData.breakfast.length),
      lunch: Math.floor(Math.random() * mealData.lunch.length),
      dinner: Math.floor(Math.random() * mealData.dinner.length),
    });
    setRefreshCount((prevCount) => prevCount + 1);
  };

  const isRefreshDisabled =
    refreshCount >= 1 && userTier !== "premium" && userTier !== "pro";

  const refreshButtonTitle = isRefreshDisabled
    ? "Upgrade to premium or pro to refresh more than once"
    : "";

  const refreshButtonText = isRefreshDisabled
    ? "Upgrade for More Refreshes"
    : "Refresh Meals";

  const renderMealCard = (category: string, meals: Meal[]) => {
    const meal = meals[mealIndexes[category as keyof typeof mealIndexes]];
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
