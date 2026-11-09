import { test, expect, type Page } from "@playwright/test";
import { format, subMonths } from "date-fns";
import { modal } from "./helpers/expense";

async function openEditBudget(page: Page) {
  await page.getByRole("button", { name: "Edit Budget" }).click();
  await expect(modal(page).getByRole("heading", { name: "Edit Budget" })).toBeVisible();
}

async function selectPeriod(page: Page, period: string) {
  const [year, month] = period.split("-").map(Number);
  const budgetResponse = page.waitForResponse(
    (res) =>
      res.url().includes("/api/budgets") &&
      res.url().includes(`month=${month}`) &&
      res.url().includes(`year=${year}`),
  );
  await modal(page).getByLabel("Budget Period").fill(period);
  await budgetResponse;
  await expect(currentBudget(page)).toHaveText(/₱\d/);
}

function currentBudget(page: Page) {
  return modal(page).getByTestId("current-budget");
}

test.describe("Edit Budget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home");
    await openEditBudget(page);
  });

  test("should display error message for negative budget", async ({ page }) => {
    await modal(page).getByLabel("Budget Amount").fill("-5");
    await modal(page).getByRole("button", { name: "Update Budget" }).click();
    await expect(modal(page).getByText("Budget cannot be negative")).toBeVisible();
  });

  test("should display error message for empty budget", async ({ page }) => {
    await modal(page).getByLabel("Budget Amount").fill("");
    await modal(page).getByRole("button", { name: "Update Budget" }).click();
    await expect(modal(page).getByText("Budget is required")).toBeVisible();
  });

  test("should update the budget of a past month", async ({ page }, testInfo) => {
    const monthsAgo = testInfo.project.name === "mobile" ? 3 : 2;
    const period = format(subMonths(new Date(), monthsAgo), "yyyy-MM");
    const amount = 1000 + Math.floor(Math.random() * 9000);

    await selectPeriod(page, period);
    await modal(page).getByLabel("Budget Amount").fill(String(amount));
    await modal(page).getByRole("button", { name: "Update Budget" }).click();
    await expect(modal(page).getByRole("heading", { name: "Edit Budget" })).toBeHidden();

    await openEditBudget(page);
    await selectPeriod(page, period);
    await expect(currentBudget(page)).toHaveText(`₱${amount}`);
  });
});
