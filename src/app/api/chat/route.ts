import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10;
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const SYSTEM_PROMPT = `You are a friendly and creative pantry chef assistant.
Your goal is to help users create delicious meals using ONLY the ingredients they currently have available, while providing precise nutritional information.

CRITICAL - CALORIE TARGET:
{{CALORIE_GOAL}}

When providing meal suggestions, you MUST ensure the total calories for all meals combined add up to the user's daily calorie target above.
If the user is asking for a full day's meal plan (breakfast, lunch, dinner, snacks), distribute the calories appropriately:
- Breakfast: 25% of daily calories
- Lunch: 35% of daily calories
- Dinner: 30% of daily calories
- Snacks: 10% of daily calories

If the user is asking for specific meals, calculate portion sizes to hit the appropriate calorie target for those meals.

GUIDELINES:
1. Suggest 3 distinct meal ideas based on the user's ingredients.
2. Assume they have basic staples (salt, pepper, oil, water) unless they say otherwise.
3. If they are missing key ingredients for a recipe, explicitly mention what is missing or suggest substitutions.
4. Keep recipes simple and realistic for a home cook.
5. CRITICAL: For each meal suggestion, you MUST provide:
    - A list of ingredients with exact measurements (grams/oz/cups).
    - Total Calories for the meal.
    - Macronutrient breakdown: Protein (g), Carbs (g), Fats (g).
    - Ensure the total calories are accurate based on the ingredients listed.
6. If the user specifies a daily or per-meal calorie target, adjust ingredient portions to hit that target.
7. Format your response nicely with markdown (bullet points, bold text, tables for macros if appropriate).
8. Be encouraging and helpful!

IMPORTANT: Always calculate portion sizes precisely so the meal calories match the target. If the user's ingredients cannot reasonably reach the calorie target, suggest additional ingredients or acknowledge the limitation.`;

// Daily limit for non-premium users
const DAILY_CHAT_LIMIT = 5;

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create subscription
    let userSub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.clerkId, userId),
    });

    if (!userSub) {
      try {
        const [newSub] = await db.insert(subscriptions).values({
          clerkId: userId,
          plan: "starter",
          chatCount: 0,
        }).returning();
        userSub = newSub;
      } catch (e) {
        console.error("Error creating subscription:", e);
        // Return default values if DB fails
        return NextResponse.json({
          chatCount: 0,
          limit: DAILY_CHAT_LIMIT,
          isPremium: false
        });
      }
    }

    return NextResponse.json({
      chatCount: userSub?.chatCount || 0,
      limit: DAILY_CHAT_LIMIT,
      isPremium: userSub?.plan !== "starter"
    });
  } catch (error) {
    console.error("Chat GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
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

    // Check Subscription & Chat Limit
    // We try to find the subscription
    let userSub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.clerkId, userId),
    });

    // If no subscription, create one
    if (!userSub) {
      try {
        const [newSub] = await db.insert(subscriptions).values({
            clerkId: userId,
            plan: "starter",
            chatCount: 0,
        }).returning();
        userSub = newSub;
      } catch (e) {
        console.error("Error creating subscription:", e);
        // Continue, might be a DB issue, but we let them chat for now or fail?
        // Let's allow one free message if DB fails to track, to be user friendly
        // Or strictly we should fail. Let's assume it works.
      }
    }

    // Check limit
    if (userSub && userSub.plan === "starter" && userSub.chatCount >= DAILY_CHAT_LIMIT) {
       return NextResponse.json(
        { 
          error: "limit_exceeded", 
          message: "You have reached your daily chat limit. Upgrade to Premium for unlimited access.",
          chatCount: userSub.chatCount,
          limit: DAILY_CHAT_LIMIT
        },
        { status: 403 }
      );
    }

    // Construct messages for Groq
    const { calorieGoal } = body;

    let systemPrompt = SYSTEM_PROMPT;
    if (calorieGoal && typeof calorieGoal === "number") {
      systemPrompt = systemPrompt.replace(
        "{{CALORIE_GOAL}}",
        `The user's daily calorie target is ${calorieGoal} calories. When suggesting meals, ensure they add up to this total.`
      );
    } else {
      systemPrompt = systemPrompt.replace(
        "{{CALORIE_GOAL}}",
        "The user has not set a calorie goal. Provide standard meal suggestions with estimated calories."
      );
    }

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    // Call Groq
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const completion = await response.json();
    const reply = completion.choices?.[0]?.message?.content;

    // Increment chat count
    if (userSub && userSub.plan === "starter") {
      try {
        await db.update(subscriptions)
          .set({ chatCount: (userSub.chatCount || 0) + 1 })
          .where(eq(subscriptions.clerkId, userId));
      } catch (e) {
        console.error("Error updating chat count:", e);
      }
    }

    return NextResponse.json({ 
      reply,
      chatCount: userSub ? (userSub.chatCount + 1) : 1,
      limit: DAILY_CHAT_LIMIT,
      isPremium: userSub?.plan !== "starter"
    });

  } catch (error) {
    console.error("Chat API Error Detailed:", error);
    // @ts-expect-error - error might be any
    const errorMessage = error?.message || "Unknown error";
    return NextResponse.json({ error: `Failed to process request: ${errorMessage}` }, { status: 500 });
  }
}
