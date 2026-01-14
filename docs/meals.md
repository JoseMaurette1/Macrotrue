# Meal Generation Strategy: Balanced Preset Meals by Calorie Goal

## Overview

This approach uses a set of preset meals (stored in the Neon PostgreSQL database) and dynamically adjusts the portion sizes for each meal based on the user's daily calorie goal. The goal is to provide a balanced diet, splitting the total calories evenly across breakfast, lunch, and dinner, and scaling the meal portions so each meal fits its calorie allocation.

## How It Works

1. **Preset Meals in Database:**

   - Meals (e.g., "Rice and Chicken") are stored in Neon with their base macros and portion sizes (e.g., 100g rice + 100g chicken = 400 kcal).
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
   - Store preset meals in Neon PostgreSQL with base macros and portion sizes.
2. **Backend/Utils:**
   - Fetch meals from database via API routes.
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

- Define the meal schema in Neon (name, ingredients, base portions, macros).
- Implement the portion scaling algorithm in your utility functions.
- Build the UI to display meals and scaled portions/macros.

---

_This approach provides a balanced, data-driven meal plan for any calorie goal, using preset meals and dynamic portion calculation. All logic is handled in-app, with meals managed in Neon for easy updates._

---

## Implementation Checklist

### Completed Tasks

- [x] Created database schema in Neon
  - [x] Created `meal_categories` table (breakfast, lunch, dinner)
  - [x] Created `meals` table with base macros and category relationships
  - [x] Created `meal_ingredients` table with ingredients and portion information
  - [x] Set up proper relationships between tables
- [x] Populated the database with sample meals
  - [x] Inserted breakfast meals with ingredients and macros
  - [x] Inserted lunch meals with ingredients and macros
  - [x] Inserted dinner meals with ingredients and macros
- [x] Updated application code
  - [x] Added database client integration in `mealUtils.ts`
  - [x] Implemented `fetchMealData()` function to retrieve meals from database
  - [x] Added fallback to JSON data source if database fetch fails
  - [x] Implemented `calculateAdjustedMeal()` function to scale portions based on calorie targets
- [x] Enhanced user interface
  - [x] Updated `Food/page.tsx` with calorie target input form
  - [x] Modified `MealData.tsx` to display adjusted portions and macros
  - [x] Added target calorie indicators for each meal category

### Testing Needed

- [ ] Test database connection with real credentials
- [ ] Verify that all meal data loads correctly from the database
- [ ] Confirm that the portion scaling algorithm works accurately
- [ ] Test the calorie target input with various values
- [ ] Verify that the UI displays adjusted portions and macros correctly
- [ ] Test the fallback to JSON when database is unavailable
- [ ] Check that meal refresh functionality works with the database

### Future Improvements

- [ ] Add user-specific meal preferences and favorites
- [ ] Implement meal filtering by dietary restrictions (vegetarian, gluten-free, etc.)
- [ ] Create an admin interface for managing meals in the database
- [ ] Add nutritional information beyond basic macros (vitamins, minerals, etc.)
- [ ] Implement weekly meal planning with different meals each day
- [ ] Add shopping list generation based on selected meals
- [ ] Develop meal search and filtering functionality
- [ ] Implement user feedback on meals (ratings, comments)
- [ ] Add meal image support in the database and UI
- [ ] Optimize database queries for better performance

---

## Recent Codebase Changes (2024-06)

- **Removed unused imports and variables** in `src/app/Food/page.tsx` and `src/app/utils/mealUtils.ts` to resolve ESLint errors and keep the codebase clean.
- **Ensured all data fetching uses TanStack Query** and the database client, following best practices for React/Next.js data management.
- **Verified database schema** matches the structure and requirements of `meals.json` and the implementation plan in this document.
- **Cleaned up state and effect logic** in `Food/page.tsx` by removing the unused `calorieInput` state and related code.
- **Maintained strict adherence to DRY and best practices**: No useEffect for data fetching, all queries are typed, and code is concise and maintainable.

These changes ensure the meal planning feature is robust, maintainable, and aligned with the documented strategy and technical standards.
