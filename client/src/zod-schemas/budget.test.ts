import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { editBudgetSchema } from "./budget";

function periodError(budgetPeriod: string) {
  const result = editBudgetSchema.safeParse({ budgetPeriod, budget: 5000 });
  return result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path.join(".") === "budgetPeriod")?.message;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 9, 9, 30));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("editBudgetSchema period", () => {
  it.each(["2026-11", "2025-12"])("accepts the current or a past period %s", (period) => {
    expect(periodError(period)).toBeUndefined();
  });

  it("rejects a future period", () => {
    expect(periodError("2026-12")).toBe("Date must not be in the future");
  });

  it.each(["2026-1", "11-2026", ""])("rejects malformed period %j", (period) => {
    expect(periodError(period)).toBe("Date period must be in YYYY-MM format");
  });
});
