import { MealCategory, Meal } from "@/app/types/meals";

/**
 * Fetches meal data from the JSON file
 */
export const fetchMealData = async (): Promise<MealCategory> => {
  try {
    const response = await fetch("/data/meals.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching meal data:", error);
    throw error;
  }
};

/**
 * Generates random indexes for each meal category
 */
export const generateRandomMealIndexes = (mealData: MealCategory) => {
  return {
    breakfast: Math.floor(Math.random() * mealData.breakfast.length),
    lunch: Math.floor(Math.random() * mealData.lunch.length),
    dinner: Math.floor(Math.random() * mealData.dinner.length),
  };
};

/**
 * Calculates total macros for a set of meals
 */
export const calculateTotalMacros = (meals: Meal[]) => {
  return meals.reduce(
    (total, meal) => {
      return {
        calories: total.calories + meal.macros.calories,
        protein: total.protein + meal.macros.protein,
        carbs: total.carbs + meal.macros.carbs,
        fat: total.fat + meal.macros.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};
