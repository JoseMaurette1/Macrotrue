import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

type UserIdColumn = "clerk_id" | "user_id";

let cachedWorkoutsIdColumn: UserIdColumn | null = null;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeWorkout = (row: unknown) => {
  if (!isRecord(row)) return null;

  const id = typeof row.id === "string" ? row.id : null;
  const workoutType =
    typeof row.workout_type === "string"
      ? row.workout_type
      : typeof row.workoutType === "string"
      ? row.workoutType
      : null;
  const exercisesRaw = row.exercises;
  const exercises =
    typeof exercisesRaw === "string"
      ? JSON.parse(exercisesRaw)
      : exercisesRaw;
  const createdAt =
    typeof row.created_at === "string"
      ? row.created_at
      : row.created_at instanceof Date
      ? row.created_at.toISOString()
      : typeof row.createdAt === "string"
      ? row.createdAt
      : null;

  if (!id || !workoutType || !createdAt) return null;

  return {
    id,
    workoutType,
    exercises,
    createdAt,
  };
};

const getWorkoutsIdColumn = async (): Promise<UserIdColumn> => {
  if (cachedWorkoutsIdColumn) return cachedWorkoutsIdColumn;

  const result = await db.execute(sql`
    select column_name
    from information_schema.columns
    where table_name = 'workouts'
      and column_name in ('clerk_id', 'user_id')
  `);

  const columnNames = new Set<string>();
  for (const row of result.rows) {
    if (isRecord(row) && typeof row.column_name === "string") {
      columnNames.add(row.column_name);
    }
  }

  if (columnNames.has("clerk_id")) {
    cachedWorkoutsIdColumn = "clerk_id";
  } else {
    cachedWorkoutsIdColumn = "user_id";
  }

  return cachedWorkoutsIdColumn;
};

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

    const idColumn = await getWorkoutsIdColumn();

    const exercisesJson = JSON.stringify(exercises);
    const insertResult = await db.execute(sql`
      insert into workouts (${sql.identifier([idColumn])}, workout_type, exercises, created_at)
      values (${userId}, ${workoutType}, ${exercisesJson}::jsonb, ${new Date()})
      returning id, ${sql.identifier([idColumn])}, workout_type, exercises, created_at
    `);

    const newWorkout = normalizeWorkout(insertResult.rows[0]);

    if (!newWorkout) {
      return NextResponse.json(
        { error: "Failed to save workout" },
        { status: 500 }
      );
    }

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

    const idColumn = await getWorkoutsIdColumn();

    const workoutsResult = await db.execute(sql`
      select id, ${sql.identifier([idColumn])}, workout_type, exercises, created_at
      from workouts
      where ${sql.identifier([idColumn])} = ${userId}
      order by created_at desc
    `);

    const normalizedWorkouts = workoutsResult.rows
      .map(normalizeWorkout)
      .filter((workout) => workout !== null);

    const filteredWorkouts = workoutType
      ? normalizedWorkouts.filter((workout) => workout.workoutType === workoutType)
      : normalizedWorkouts;

    return NextResponse.json({ workouts: filteredWorkouts });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}
