import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workoutType, exercises } = body;

    if (!workoutType || !exercises) {
      return NextResponse.json(
        { error: "Missing workoutType or exercises" },
        { status: 400 }
      );
    }

    const [newWorkout] = await db
      .insert(workouts)
      .values({
        clerkId: userId,
        workoutType,
        exercises,
      })
      .returning();

    return NextResponse.json({ success: true, workout: newWorkout });
  } catch (error) {
    console.error("Error saving workout:", error);
    return NextResponse.json(
      { error: "Failed to save workout" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workoutType = searchParams.get("type");

    let query = db
      .select()
      .from(workouts)
      .where(eq(workouts.clerkId, userId))
      .orderBy(desc(workouts.createdAt));

    if (workoutType) {
      query = db
        .select()
        .from(workouts)
        .where(eq(workouts.clerkId, userId))
        .orderBy(desc(workouts.createdAt));
    }

    const userWorkouts = await query;

    const filteredWorkouts = workoutType
      ? userWorkouts.filter((w) => w.workoutType === workoutType)
      : userWorkouts;

    return NextResponse.json({ workouts: filteredWorkouts });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}
