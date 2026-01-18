import { db } from "@/db";
import { sql } from "drizzle-orm";
import { isRecord } from "@/lib/utils";

export type UserIdColumn = "clerk_id" | "user_id";

let cachedSubscriptionsIdColumn: UserIdColumn | null = null;

export const resetCachedSubscriptionsIdColumn = () => {
  cachedSubscriptionsIdColumn = null;
};

export const getSubscriptionsIdColumn = async (): Promise<UserIdColumn> => {
  if (cachedSubscriptionsIdColumn) return cachedSubscriptionsIdColumn;

  const result = await db.execute(sql`
    select column_name
    from information_schema.columns
    where table_name = 'subscriptions'
      and column_name in ('clerk_id', 'user_id')
  `);

  const columnNames = new Set<string>();
  for (const row of result.rows) {
    if (isRecord(row) && typeof row.column_name === "string") {
      columnNames.add(row.column_name);
    }
  }

  cachedSubscriptionsIdColumn = columnNames.has("clerk_id")
    ? "clerk_id"
    : "user_id";

  return cachedSubscriptionsIdColumn;
};
