import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Rate limiting - simple in-memory store (use Redis for production)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per IP

// Protein-focused macro split: 30% protein, 40% carbs, 30% fat
const MACRO_SPLIT = {
  protein: 0.30,
  carbs: 0.40,
  fat: 0.30,
};

const MEAL_SPLIT = {
  breakfast: 0.25, // 25% of daily calories
  lunch: 0.35,     // 35% of daily calories
  dinner: 0.40,    // 40% of daily calories
};

const SYSTEM_PROMPT = `You are a professional nutritionist. Generate 3 complete meals that sum exactly to the user's daily calorie target.

IMPORTANT RULES:
1. Each meal MUST include specific portion amounts (grams, ounces, cups, etc.)
2. Include a protein source in every meal
3. Use common, affordable ingredients
4. Calculate macros accurately - they must sum to the target breakdown
5. Return ONLY valid JSON - no markdown, no comments, no explanations
6. Be creative with meal variety - avoid repeating similar meals
7. Consider typical meal timing (breakfast: lighter, dinner: heartier)`;

function buildUserPrompt(calories: number, preferences?: string) {
  const protein = Math.round((calories * MACRO_SPLIT.protein) / 4); // 4 cal per gram
  const carbs = Math.round((calories * MACRO_SPLIT.carbs) / 4); // 4 cal per gram
  const fat = Math.round((calories * MACRO_SPLIT.fat) / 9); // 9 cal per gram

  const breakfastCalories = Math.round(calories * MEAL_SPLIT.breakfast);
  const lunchCalories = Math.round(calories * MEAL_SPLIT.lunch);
  const dinnerCalories = Math.round(calories * MEAL_SPLIT.dinner);

  const breakfastProtein = Math.round(protein * MEAL_SPLIT.breakfast);
  const lunchProtein = Math.round(protein * MEAL_SPLIT.lunch);
  const dinnerProtein = Math.round(protein * MEAL_SPLIT.dinner);

  return `DAILY TARGET: ${calories} calories

MACRO TARGETS:
- Protein: ${protein}g
- Carbs: ${carbs}g
- Fat: ${fat}g

MEAL CALORIE BREAKDOWN:
- Breakfast: ~${breakfastCalories} cal (${breakfastProtein}g protein)
- Lunch: ~${lunchCalories} cal (${lunchProtein}g protein)
- Dinner: ~${dinnerCalories} cal (${dinnerProtein}g protein)

${preferences ? `USER PREFERENCES: ${preferences}` : ""}

REQUIREMENTS:
- Breakfast should be around ${breakfastCalories} calories
- Lunch should be around ${lunchCalories} calories
- Dinner should be around ${dinnerCalories} calories
- Total must equal ${calories} calories (allow +/- 50 cal variance)
- Each meal must have at least 25g of protein

JSON OUTPUT FORMAT:
{
  "breakfast": {
    "name": "Descriptive meal name",
    "portions": "Ingredient 1 (amount), Ingredient 2 (amount), ...",
    "macros": { "calories": number, "protein": number, "carbs": number, "fat": number }
  },
  "lunch": {
    "name": "Descriptive meal name",
    "portions": "Ingredient 1 (amount), Ingredient 2 (amount), ...",
    "macros": { "calories": number, "protein": number, "carbs": number, "fat": number }
  },
  "dinner": {
    "name": "Descriptive meal name",
    "portions": "Ingredient 1 (amount), Ingredient 2 (amount), ...",
    "macros": { "calories": number, "protein": number, "carbs": number, "fat": number }
  },
  "total": { "calories": number, "protein": number, "carbs": number, "fat": number }
}

Return valid JSON only:`;
}

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

interface MealRecommendations {
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

function validateResponse(data: unknown): data is MealRecommendations {
  if (!data || typeof data !== "object") return false;

  const d = data as Record<string, unknown>;

  // Check required fields
  const requiredMeals = ["breakfast", "lunch", "dinner"];
  for (const meal of requiredMeals) {
    const mealData = d[meal];
    if (!mealData || typeof mealData !== "object") return false;

    const m = mealData as Record<string, unknown>;
    if (!m.name || !m.portions || !m.macros) return false;
    if (typeof m.name !== "string" || typeof m.portions !== "string") return false;

    const macros = m.macros as Record<string, unknown>;
    if (
      typeof macros.calories !== "number" ||
      typeof macros.protein !== "number" ||
      typeof macros.carbs !== "number" ||
      typeof macros.fat !== "number"
    ) {
      return false;
    }
  }

  // Check total
  if (!d.total || typeof d.total !== "object") return false;
  const total = d.total as Record<string, unknown>;
  if (
    typeof total.calories !== "number" ||
    typeof total.protein !== "number" ||
    typeof total.carbs !== "number" ||
    typeof total.fat !== "number"
  ) {
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const calories = searchParams.get("calories");
    const preferences = searchParams.get("preferences") || undefined;

    if (!calories) {
      return NextResponse.json(
        { error: "calories parameter is required" },
        { status: 400 }
      );
    }

    const calorieTarget = parseInt(calories, 10);
    if (isNaN(calorieTarget) || calorieTarget < 1000 || calorieTarget > 5000) {
      return NextResponse.json(
        { error: "calories must be a number between 1000 and 5000" },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const entry = rateLimitStore.get(clientIp);

    if (entry && now < entry.resetTime) {
      if (entry.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Call Groq API using fetch
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(calorieTarget, preferences) },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const completion = await response.json();
    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in Groq response");
    }

    // Parse JSON from response
    // Sometimes the model wraps JSON in markdown code blocks
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!validateResponse(parsed)) {
      console.error("Invalid response structure:", parsed);
      throw new Error("Invalid response structure from Groq");
    }

    // Calculate actual totals for verification
    const actualTotal = {
      calories:
        parsed.breakfast.macros.calories +
        parsed.lunch.macros.calories +
        parsed.dinner.macros.calories,
      protein:
        parsed.breakfast.macros.protein +
        parsed.lunch.macros.protein +
        parsed.dinner.macros.protein,
      carbs:
        parsed.breakfast.macros.carbs +
        parsed.lunch.macros.carbs +
        parsed.dinner.macros.carbs,
      fat:
        parsed.breakfast.macros.fat +
        parsed.lunch.macros.fat +
        parsed.dinner.macros.fat,
    };

    // Return with actual calculated totals
    return NextResponse.json({
      breakfast: parsed.breakfast,
      lunch: parsed.lunch,
      dinner: parsed.dinner,
      total: actualTotal,
    });
  } catch (error) {
    console.error("Error generating meal recommendations:", error);

    // Return a fallback error - frontend will handle static fallback
    return NextResponse.json(
      {
        error: "Failed to generate meal recommendations",
        fallback: true,
      },
      { status: 500 }
    );
  }
}
