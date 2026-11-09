import { test, expect } from "@playwright/test";
import { format } from "date-fns";
import { deleteExpense, seedExpense } from "./helpers/expense";
import { dayOf, goBackMonths, monthsAgo } from "./helpers/month";

test.describe("Analytics", () => {
  let seededId: number | undefined;

  test.afterEach(async ({ page }) => {
    if (seededId) await deleteExpense(page.request, seededId);
    seededId = undefined;
  });

  test("should show a past month's spending", async ({ page }, testInfo) => {
    const monthsBack = testInfo.project.name === "mobile" ? 5 : 4;
    const month = monthsAgo(monthsBack);
    const category = `e2e-${testInfo.project.name}-${Math.random().toString(36).slice(2, 8)}`;
    const date = dayOf(month, 5);

    seededId = await seedExpense(page.request, {
      category,
      amount: 1000000,
      date,
      description: "e2e analytics",
    });

    await page.goto("/analytics");
    await expect(page.getByRole("button", { name: "Next month" })).toBeDisabled();
    await goBackMonths(page, monthsBack);

    await expect(page.getByText("Budget Remaining")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Expenses by Category" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Top Expenses" })).toBeVisible();
    await expect(page.getByText(`${category} • ${format(month, "MMMM")} 5`)).toBeVisible();
  });
});
