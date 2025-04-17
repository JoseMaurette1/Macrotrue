# Meal Generation Strategy: Balanced Preset Meals by Calorie Goal

## Overview
This approach uses a set of preset meals (stored in Supabase) and dynamically adjusts the portion sizes for each meal based on the user's daily calorie goal. The goal is to provide a balanced diet, splitting the total calories evenly across breakfast, lunch, and dinner, and scaling the meal portions so each meal fits its calorie allocation.

## How It Works
1. **Preset Meals in Database:**
   - Meals (e.g., "Rice and Chicken") are stored in Supabase with their base macros and portion sizes (e.g., 100g rice + 100g chicken = 400 kcal).
   - Each meal record includes: name, ingredients, base portion size, and macros per base portion.

2. **User Calorie Goal Input:**
   - User sets their daily calorie goal (e.g., 1500 kcal or 3000 kcal).

3. **Balanced Calorie Split:**
   - The app divides the total calories evenly across three meals (breakfast, lunch, dinner).
   - Example: 1500 kcal/day → 500 kcal per meal; 3000 kcal/day → 1000 kcal per meal.

4. **Dynamic Portion Calculation Algorithm:**
   - For each meal, calculate the scaling factor needed to reach the target calories:
     - `scalingFactor = targetMealCalories / baseMealCalories`
   - Multiply each ingredient's base portion by the scaling factor to get the new portion size (in grams/ounces).
   - Recalculate macros for the scaled portion.

5. **Display to User:**
   - Show the meal name, new portion sizes for each ingredient, and updated macros for each meal.
   - Ensure the sum of all meals matches the user's daily calorie goal.

## Example
- **User selects 1500 kcal/day**
- **Lunch preset:** Rice and Chicken (base: 100g rice + 100g chicken = 400 kcal)
- **Target per meal:** 500 kcal
- **Scaling factor:** 500 / 400 = 1.25
- **New portions:** 125g rice + 125g chicken = 500 kcal (macros scaled accordingly)

## Implementation Plan
1. **Database:**
   - Store preset meals in Supabase with base macros and portion sizes.
2. **Backend/Utils:**
   - Fetch meals from Supabase.
   - Implement a function to calculate scaling factors and adjust portions/macros.
3. **Frontend:**
   - Collect user calorie goal.
   - Display three meals per day, each with dynamically calculated portions and macros.
   - Ensure UI clearly shows ingredient amounts and total macros per meal.

## Benefits
- Simple, reliable, and easy to maintain.
- No need for AI or external APIs.
- Highly customizable: just add/edit meals in the database.
- Scales to any calorie goal and supports any number of preset meals.

## Next Steps
- Define the meal schema in Supabase (name, ingredients, base portions, macros).
- Implement the portion scaling algorithm in your utility functions.
- Build the UI to display meals and scaled portions/macros.

---

*This approach provides a balanced, data-driven meal plan for any calorie goal, using preset meals and dynamic portion calculation. All logic is handled in-app, with meals managed in Supabase for easy updates.* 