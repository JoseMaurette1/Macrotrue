import { MealCategory, Meal } from "@/app/types/meals";
import { supabase, hasValidSupabaseConfig } from "@/lib/supabase";

/**
 * Fetches meal data from the JSON file (legacy method)
 */
export const fetchMealDataFromJson = async (): Promise<MealCategory> => {
  try {
    const response = await fetch("/data/meals.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching meal data from JSON:", error);
    // Return empty data structure if fallback fails
    return {
      breakfast: [],
      lunch: [],
      dinner: [],
    };
  }
};

/**
 * Fetches meal data from Supabase database
 */
export const fetchMealData = async (): Promise<MealCategory> => {
  try {
    // Validate supabase client exists
    if (!hasValidSupabaseConfig || !supabase) {
      console.warn(
        "Supabase configuration invalid or client initialization failed, falling back to JSON data source"
      );
      return fetchMealDataFromJson();
    }

    // Try to safely get all meal categories with error handling
    let categories;
    try {
      // Wrap this specific query in its own try-catch to handle the empty error object
      const { data } = await supabase
        .from("meal_categories")
        .select("id, name");

      // Even with an empty error object, if data is null or empty, we have a problem
      if (!data || data.length === 0) {
        console.warn(
          "No meal categories found or query failed, falling back to JSON data source"
        );
        return fetchMealDataFromJson();
      }

      categories = data;
    } catch (categoryError) {
      console.error("Error fetching meal categories:", categoryError);
      return fetchMealDataFromJson();
    }

    // If we got here, we have categories data
    // Initialize result object
    const result: MealCategory = {
      breakfast: [],
      lunch: [],
      dinner: [],
    };

    // For each category, get all meals and their ingredients
    for (const category of categories) {
      // Get meals for this category
      const { data: meals, error: mealsError } = await supabase
        .from("meals")
        .select("id, name, base_calories, base_protein, base_carbs, base_fat")
        .eq("category_id", category.id);

      if (mealsError) {
        console.error(
          `Error fetching meals for category ${category.name}:`,
          mealsError
        );
        continue; // Skip this category but don't fail completely
      }

      if (!meals || meals.length === 0) {
        console.warn(`No meals found for category ${category.name}`);
        continue;
      }

      // For each meal, get its ingredients
      for (const meal of meals) {
        const { data: ingredients, error: ingredientsError } = await supabase
          .from("meal_ingredients")
          .select("name, base_amount, unit")
          .eq("meal_id", meal.id);

        if (ingredientsError) {
          console.error(
            `Error fetching ingredients for meal ${meal.name}:`,
            ingredientsError
          );
          continue; // Skip this meal but don't fail completely
        }

        // Default ingredients if none found
        interface Ingredient {
          name: string;
          base_amount: number;
          unit: string;
        }

        const mealIngredients: Ingredient[] =
          ingredients && ingredients.length > 0
            ? ingredients
            : [{ name: "Default ingredient", base_amount: 100, unit: "g" }];

        // Format portions string from ingredients
        const portions = mealIngredients
          .map(
            (ing: Ingredient) => `${ing.name} (${ing.base_amount}${ing.unit})`
          )
          .join(", ");

        // Create meal object
        const formattedMeal: Meal = {
          name: meal.name,
          portions: portions,
          macros: {
            calories: meal.base_calories,
            protein: meal.base_protein,
            carbs: meal.base_carbs,
            fat: meal.base_fat,
          },
        };

        // Add meal to appropriate category
        const categoryKey = category.name.toLowerCase() as keyof MealCategory;
        if (result[categoryKey]) {
          result[categoryKey].push(formattedMeal);
        } else {
          // Handle case where category name doesn't match expected keys
          console.warn(`Unknown category name: ${category.name}`);
        }
      }
    }

    // Check if any meals were loaded
    const totalMeals = Object.values(result).reduce(
      (total, meals) => total + meals.length,
      0
    );

    if (totalMeals === 0) {
      console.warn(
        "No meals were loaded from Supabase, falling back to JSON data source"
      );
      return fetchMealDataFromJson();
    }

    return result;
  } catch (error) {
    console.error("Error fetching meal data from Supabase:", error);

    // Fallback to JSON if Supabase fails
    console.log("Falling back to JSON data source");
    return fetchMealDataFromJson();
  }
};

/**
 * Calculates adjusted portions and macros based on a calorie target
 */
export const calculateAdjustedMeal = (
  meal: Meal,
  targetCalories: number
): Meal => {
  // Calculate scaling factor
  const scalingFactor = targetCalories / meal.macros.calories;

  // Get ingredients from the portions string
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

  // Create new portions string
  const newPortions = ingredients
    .map((ing) => `${ing.name} (${ing.amount}${ing.unit})`)
    .join(", ");

  // Adjust macros
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
