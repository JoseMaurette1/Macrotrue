import { MealCategory, Meal } from "@/app/types/meals";

export const fetchMealDataFromJson = async (): Promise<MealCategory> => {
  try {
    const response = await fetch("/data/meals.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching meal data from JSON:", error);
    return {
      breakfast: [],
      lunch: [],
      dinner: [],
    };
  }
};

export const fetchMealData = async (): Promise<MealCategory> => {
  return fetchMealDataFromJson();
};

export const calculateAdjustedMeal = (
  meal: Meal,
  targetCalories: number
): Meal => {
  const scalingFactor = targetCalories / meal.macros.calories;

  const ingredientRegex = /([^,]+)\s+\((\d+(?:\.\d+)?)([a-zA-Z]+)\)/g;
  let match;
  const ingredients = [];

  while ((match = ingredientRegex.exec(meal.portions)) !== null) {
    const [, name, amount, unit] = match;
    const newAmount = Math.round(parseFloat(amount) * scalingFactor);
    ingredients.push({
      name: name.trim(),
      amount: newAmount,
      unit,
    });
  }

  const newPortions = ingredients
    .map((ing) => `${ing.name} (${ing.amount}${ing.unit})`)
    .join(", ");

  const newMacros = {
    calories: Math.round(meal.macros.calories * scalingFactor),
    protein: Math.round(meal.macros.protein * scalingFactor),
    carbs: Math.round(meal.macros.carbs * scalingFactor),
    fat: Math.round(meal.macros.fat * scalingFactor),
  };

  return {
    name: meal.name,
    portions: newPortions,
    macros: newMacros,
  };
};

export const generateRandomMealIndexes = (mealData: MealCategory) => {
  return {
    breakfast: Math.floor(Math.random() * mealData.breakfast.length),
    lunch: Math.floor(Math.random() * mealData.lunch.length),
    dinner: Math.floor(Math.random() * mealData.dinner.length),
  };
};

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
