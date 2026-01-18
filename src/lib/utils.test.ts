import { describe, expect, test } from "bun:test";
import { isSameDay, isRecord } from "./utils";

describe("isSameDay", () => {
  test("returns true for same day", () => {
    const date1 = new Date("2023-10-26T10:00:00Z");
    const date2 = new Date("2023-10-26T15:30:00Z");
    expect(isSameDay(date1, date2)).toBe(true);
  });

  test("returns false for different days", () => {
    const date1 = new Date("2023-10-26T10:00:00Z");
    const date2 = new Date("2023-10-27T10:00:00Z");
    expect(isSameDay(date1, date2)).toBe(false);
  });

  test("returns false for different months", () => {
    const date1 = new Date("2023-10-26T10:00:00Z");
    const date2 = new Date("2023-11-26T10:00:00Z");
    expect(isSameDay(date1, date2)).toBe(false);
  });

  test("returns false for different years", () => {
    const date1 = new Date("2023-10-26T10:00:00Z");
    const date2 = new Date("2024-10-26T10:00:00Z");
    expect(isSameDay(date1, date2)).toBe(false);
  });
});

describe("isRecord", () => {
  test("returns true for objects", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord({ a: 1 })).toBe(true);
  });

  test("returns false for null", () => {
    expect(isRecord(null)).toBe(false);
  });

  test("returns false for primitives", () => {
    expect(isRecord(1)).toBe(false);
    expect(isRecord("string")).toBe(false);
    expect(isRecord(true)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
  });
});
