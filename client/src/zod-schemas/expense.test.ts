import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { expenseSchema } from "./expense";

const valid = {
  category: "Food",
  description: "Lunch",
  amount: 150,
  date: "2026-11-09",
};

function dateError(date: string) {
  const result = expenseSchema.safeParse({ ...valid, date });
  return result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path.join(".") === "date")?.message;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 9, 9, 30));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("expenseSchema date", () => {
  it("accepts a valid expense and keeps the date as yyyy-MM-dd", () => {
    expect(expenseSchema.parse(valid)).toEqual(valid);
  });

  it("allows today's date", () => {
    expect(dateError("2026-11-09")).toBeUndefined();
  });

  it("rejects a future date", () => {
    expect(dateError("2026-11-10")).toBe("Date must not be in the future");
  });

  it("rejects an unparseable date", () => {
    expect(dateError("not-a-date")).toBe("Invalid date");
  });
});
