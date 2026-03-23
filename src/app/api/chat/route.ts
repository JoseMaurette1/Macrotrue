import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { getSubscriptionsIdColumn, type UserIdColumn } from "@/lib/db-helper";
import { isRecord, isSameDay } from "@/lib/utils";
import { createLogger } from "@/lib/logger";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// llama-3.3-70b-versatile pricing (USD per token) — update if Groq changes pricing
const GROQ_PRICE_PER_INPUT_TOKEN = 0.00000059;
const GROQ_PRICE_PER_OUTPUT_TOKEN = 0.00000079;

// Rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10;
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Input guardrails
const MAX_MESSAGES = 20;
const MAX_TOTAL_CHARS = 16_000; // ~4,000 tokens of context
const ALLOWED_ROLES = new Set(["user", "assistant"]);

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

const getSubscription = async (userId: string) => {
  const idColumn = await getSubscriptionsIdColumn();

  const result = await db.execute(sql`
    select id, plan, chat_count, updated_at
    from subscriptions
    where ${sql.identifier(idColumn)} = ${userId}
    limit 1
  `);

  const row = result.rows[0];
  if (!isRecord(row)) return null;

  return {
    id: typeof row.id === "string" ? row.id : null,
    plan: typeof row.plan === "string" ? row.plan : "starter",
    chatCount: typeof row.chat_count === "number" ? row.chat_count : 0,
    updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at as string),
    idColumn
  };
};

const createSubscription = async (userId: string, idColumn: UserIdColumn) => {
  const now = new Date();
  await db.execute(sql`
    insert into subscriptions (${sql.identifier(idColumn)}, plan, status, chat_count, created_at, updated_at)
    values (${userId}, 'starter', 'active', 0, ${now}, ${now})
  `);

  return {
    id: null,
    plan: "starter",
    chatCount: 0,
    updatedAt: now,
    idColumn
  };
};

export async function GET() {
  const correlationId = crypto.randomUUID();
  const log = createLogger(correlationId);
  const headers = { "X-Correlation-Id": correlationId };

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    // Get or create subscription
    let userSub = await getSubscription(userId);

    if (!userSub) {
      try {
        const idColumn = await getSubscriptionsIdColumn();
        userSub = await createSubscription(userId, idColumn);
      } catch (e) {
        log.error("chat.db_create_subscription_error", { userId, error: String(e) });
        return NextResponse.json({
          chatCount: 0,
          limit: DAILY_CHAT_LIMIT,
          isPremium: false
        }, { headers });
      }
    }

    return NextResponse.json({
      chatCount: userSub?.chatCount || 0,
      limit: DAILY_CHAT_LIMIT,
      isPremium: userSub?.plan !== "starter"
    }, { headers });
  } catch (error) {
    log.error("chat.unhandled_error", { error: String(error) });
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500, headers });
  }
}

export async function POST(request: NextRequest) {
  const correlationId = crypto.randomUUID();
  const log = createLogger(correlationId);
  const headers = { "X-Correlation-Id": correlationId };
  const start = Date.now();

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    const body = await request.json();
    const { messages, calorieGoal } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400, headers });
    }

    // --- Input Guardrails ---

    // 1. Message count limit — unbounded history is a cost and injection risk
    if (messages.length > MAX_MESSAGES) {
      log.warn("chat.input.message_count_exceeded", { userId, count: messages.length });
      return NextResponse.json(
        { error: "Conversation too long. Please start a new chat." },
        { status: 400, headers }
      );
    }

    // 2. Total character cap — prevents token-stuffing
    const totalChars = messages.reduce(
      (sum: number, m: { content?: string }) =>
        sum + (typeof m.content === "string" ? m.content.length : 0),
      0
    );
    if (totalChars > MAX_TOTAL_CHARS) {
      log.warn("chat.input.content_too_long", { userId, totalChars });
      return NextResponse.json(
        { error: "Message content is too long." },
        { status: 400, headers }
      );
    }

    // 3. Role allowlist — blocks clients from injecting a system-role message into the Groq call
    for (const msg of messages) {
      if (
        typeof msg !== "object" ||
        msg === null ||
        !ALLOWED_ROLES.has(msg.role) ||
        typeof msg.content !== "string"
      ) {
        log.warn("chat.input.invalid_message_shape", { userId, role: msg?.role });
        return NextResponse.json(
          { error: "Invalid message format." },
          { status: 400, headers }
        );
      }
    }

    // 4. calorieGoal range validation — value is interpolated directly into the system prompt
    if (calorieGoal !== undefined && calorieGoal !== null) {
      if (typeof calorieGoal !== "number" || calorieGoal < 500 || calorieGoal > 10_000) {
        return NextResponse.json(
          { error: "calorieGoal must be a number between 500 and 10000" },
          { status: 400, headers }
        );
      }
    }

    // --- Rate limiting ---
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const entry = rateLimitStore.get(clientIp);

    if (entry && now < entry.resetTime) {
      if (entry.count >= RATE_LIMIT_MAX) {
        log.warn("chat.rate_limited", { userId, ip: clientIp });
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429, headers }
        );
      }
      entry.count++;
    } else {
      rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // --- Subscription & Chat Limit ---
    let userSub = await getSubscription(userId);

    if (!userSub) {
      try {
        const idColumn = await getSubscriptionsIdColumn();
        userSub = await createSubscription(userId, idColumn);
      } catch (e) {
        log.warn("chat.db_create_subscription_error", { userId, error: String(e) });
      }
    }

    if (userSub && userSub.plan === "starter") {
      const nowDate = new Date();
      if (!isSameDay(nowDate, userSub.updatedAt)) {
        userSub.chatCount = 0;
      }

      if (userSub.chatCount >= DAILY_CHAT_LIMIT) {
        return NextResponse.json(
          {
            error: "limit_exceeded",
            message: "You have reached your daily chat limit. Upgrade to Premium for unlimited access.",
            chatCount: userSub.chatCount,
            limit: DAILY_CHAT_LIMIT
          },
          { status: 403, headers }
        );
      }
    }

    // --- Build system prompt ---
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

    // NOTE: message content is intentionally not logged to prevent PII/sensitive data exposure.
    // The correlationId + userId + ts fields provide the minimal audit record for compliance purposes.
    log.info("chat.request", { userId, messageCount: messages.length, hasCalorieGoal: !!calorieGoal });

    // --- Call Groq ---
    const groqStart = Date.now();
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
    const groqLatencyMs = Date.now() - groqStart;

    if (!response.ok) {
      log.error("chat.groq_error", { userId, status: response.status, groqLatencyMs });
      throw new Error(`Groq API error: ${response.status}`);
    }

    const completion = await response.json();
    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("Invalid response from Groq API: missing content");
    }

    // --- Token usage & cost tracking ---
    const usage = completion.usage as {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    } | undefined;

    const estimatedCostUsd = usage?.prompt_tokens !== undefined && usage?.completion_tokens !== undefined
      ? (usage.prompt_tokens * GROQ_PRICE_PER_INPUT_TOKEN) + (usage.completion_tokens * GROQ_PRICE_PER_OUTPUT_TOKEN)
      : undefined;

    log.info("chat.groq_success", {
      userId,
      groqLatencyMs,
      totalLatencyMs: Date.now() - start,
      promptTokens: usage?.prompt_tokens,
      completionTokens: usage?.completion_tokens,
      totalTokens: usage?.total_tokens,
      estimatedCostUsd,
    });

    // --- Increment chat count ---
    if (userSub && userSub.plan === "starter") {
      try {
        const newCount = (userSub.chatCount || 0) + 1;
        const nowDate = new Date();

        await db.execute(sql`
          update subscriptions
          set chat_count = ${newCount},
              updated_at = ${nowDate}
          where ${sql.identifier(userSub.idColumn)} = ${userId}
        `);

        userSub.chatCount = newCount;
      } catch (e) {
        log.warn("chat.db_update_count_error", { userId, error: String(e) });
      }
    }

    return NextResponse.json({
      reply,
      chatCount: userSub ? userSub.chatCount : 1,
      limit: DAILY_CHAT_LIMIT,
      isPremium: userSub?.plan !== "starter"
    }, { headers });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.error("chat.unhandled_error", { error: errorMessage, totalLatencyMs: Date.now() - start });
    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500, headers }
    );
  }
}
