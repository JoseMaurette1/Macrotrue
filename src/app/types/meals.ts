export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  name: string;
  portions: string;
  macros: MacroNutrients;
}

export interface MealCategory {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

export interface MealIndexes {
  breakfast: number;
  lunch: number;
  dinner: number;
}
