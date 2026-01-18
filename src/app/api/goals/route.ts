import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

type UserIdColumn = "clerk_id" | "user_id";

let cachedUserGoalsIdColumn: UserIdColumn | null = null;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getUserGoalsIdColumn = async (): Promise<UserIdColumn> => {
  if (cachedUserGoalsIdColumn) return cachedUserGoalsIdColumn;

  const result = await db.execute(sql`
    select column_name
    from information_schema.columns
    where table_name = 'user_goals'
      and column_name in ('clerk_id', 'user_id')
  `);

  const columnNames = new Set<string>();
  for (const row of result.rows) {
    if (isRecord(row) && typeof row.column_name === "string") {
      columnNames.add(row.column_name);
    }
  }

  if (columnNames.has("clerk_id")) {
    cachedUserGoalsIdColumn = "clerk_id";
  } else {
    cachedUserGoalsIdColumn = "user_id";
  }

  return cachedUserGoalsIdColumn;
};

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idColumn = await getUserGoalsIdColumn();

    const goalResult = await db.execute(sql`
      select calorie_goal
      from user_goals
      where ${sql.identifier(idColumn)} = ${userId}
      limit 1
    `);

    const goalRow = goalResult.rows[0];
    const calorieGoal =
      isRecord(goalRow) && typeof goalRow.calorie_goal === "number"
        ? goalRow.calorie_goal
        : null;

    if (!calorieGoal) {
      return NextResponse.json({ calorieGoal: null });
    }

    return NextResponse.json({ calorieGoal });
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

    const idColumn = await getUserGoalsIdColumn();

    const existingResult = await db.execute(sql`
      select id
      from user_goals
      where ${sql.identifier(idColumn)} = ${userId}
      limit 1
    `);

    const existingRow = existingResult.rows[0];
    const hasExisting = Boolean(existingRow);

    if (hasExisting) {
      await db.execute(sql`
        update user_goals
        set calorie_goal = ${calorieGoal},
            updated_at = ${new Date()}
        where ${sql.identifier(idColumn)} = ${userId}
      `);
    } else {
      await db.execute(sql`
        insert into user_goals (${sql.identifier(idColumn)}, calorie_goal, updated_at)
        values (${userId}, ${calorieGoal}, ${new Date()})
      `);
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
