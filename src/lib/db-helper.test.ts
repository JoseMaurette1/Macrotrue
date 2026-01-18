import { describe, expect, test, mock, beforeEach } from "bun:test";

const mockExecute = mock();

mock.module("@/db", () => ({
  db: {
    execute: mockExecute,
  },
}));

const { getSubscriptionsIdColumn, resetCachedSubscriptionsIdColumn } = await import("./db-helper");

describe("getSubscriptionsIdColumn", () => {
  beforeEach(() => {
    resetCachedSubscriptionsIdColumn();
    mockExecute.mockReset();
  });

  test("returns clerk_id when present", async () => {
    mockExecute.mockResolvedValue({
      rows: [{ column_name: "clerk_id" }, { column_name: "other_col" }],
    });

    const col = await getSubscriptionsIdColumn();
    expect(col).toBe("clerk_id");
  });

  test("returns user_id when clerk_id is missing", async () => {
    mockExecute.mockResolvedValue({
      rows: [{ column_name: "user_id" }],
    });

    const col = await getSubscriptionsIdColumn();
    expect(col).toBe("user_id");
  });
  
  test("caches the result", async () => {
    mockExecute.mockResolvedValue({
      rows: [{ column_name: "clerk_id" }],
    });

    await getSubscriptionsIdColumn();
    await getSubscriptionsIdColumn();
    
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });
});
