import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { userGoals } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [goal] = await db
      .select()
      .from(userGoals)
      .where(eq(userGoals.clerkId, userId))
      .limit(1);

    if (!goal) {
      return NextResponse.json({ calorieGoal: null });
    }

    return NextResponse.json({ calorieGoal: goal.calorieGoal });
  } catch (error) {
    console.error("Error fetching goal:", error);
    return NextResponse.json(
      { error: "Failed to fetch goal" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { calorieGoal } = body;

    if (typeof calorieGoal !== "number" || calorieGoal <= 0) {
      return NextResponse.json(
        { error: "Invalid calorie goal" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(userGoals)
      .where(eq(userGoals.clerkId, userId))
      .limit(1);

    if (existing) {
      await db
        .update(userGoals)
        .set({ calorieGoal, updatedAt: new Date() })
        .where(eq(userGoals.clerkId, userId));
    } else {
      await db.insert(userGoals).values({
        clerkId: userId,
        calorieGoal,
      });
    }

    return NextResponse.json({ success: true, calorieGoal });
  } catch (error) {
    console.error("Error saving goal:", error);
    return NextResponse.json(
      { error: "Failed to save goal" },
      { status: 500 }
    );
  }
}
