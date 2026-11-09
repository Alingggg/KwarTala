import { test, expect, type Page } from "@playwright/test";
import { format } from "date-fns";
import { deleteExpense, seedExpense } from "./helpers/expense";
import { MAX_MONTHS_BACK, dayOf, goBackMonths, monthsAgo } from "./helpers/month";

function transactionList(page: Page) {
  return page.getByRole("list", { name: "Transactions" });
}

function transactionCards(page: Page, prefix: string) {
  return transactionList(page).getByRole("listitem").filter({ hasText: prefix });
}

test.describe("Transactions", () => {
  const seededIds: number[] = [];

  test.beforeEach(async ({ page }) => {
    await page.goto("/transactions");
  });

  test.afterEach(async ({ page }) => {
    await Promise.all(seededIds.map((id) => deleteExpense(page.request, id)));
    seededIds.length = 0;
  });

  test("should navigate between months within the allowed range", async ({ page }) => {
    const previous = page.getByRole("button", { name: "Previous month" });
    const next = page.getByRole("button", { name: "Next month" });
    const now = new Date();

    await expect(page.getByRole("heading", { level: 2, name: format(now, "MMMM yyyy") })).toBeVisible();
    await expect(page.getByRole("heading", { name: `All ${format(now, "MMMM")} Transactions` })).toBeVisible();
    await expect(next).toBeDisabled();

    await previous.click();
    const lastMonth = monthsAgo(1);
    await expect(page.getByRole("heading", { level: 2, name: format(lastMonth, "MMMM yyyy") })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: `All ${format(lastMonth, "MMMM")} Transactions` }),
    ).toBeVisible();
    await expect(next).toBeEnabled();

    await next.click();
    await expect(page.getByRole("heading", { level: 2, name: format(now, "MMMM yyyy") })).toBeVisible();

    await goBackMonths(page, MAX_MONTHS_BACK);
    await expect(previous).toBeDisabled();
  });

  test("should filter by week and sort transactions", async ({ page }, testInfo) => {
    const prefix = `e2e-${testInfo.project.name}-${Math.random().toString(36).slice(2, 8)}`;
    const month = monthsAgo(MAX_MONTHS_BACK);
    const early = `${prefix}-early`;
    const late = `${prefix}-late`;

    seededIds.push(
      await seedExpense(page.request, { category: early, amount: 10, date: dayOf(month, 3) }),
      await seedExpense(page.request, { category: late, amount: 20, date: dayOf(month, 10) }),
    );

    await page.reload();
    await goBackMonths(page, MAX_MONTHS_BACK);
    const cards = transactionCards(page, prefix);

    await test.step("all weeks, newest first", async () => {
      await expect(cards).toHaveText([new RegExp(late), new RegExp(early)]);
    });

    await test.step("oldest first", async () => {
      await page.getByRole("button", { name: "Oldest" }).click();
      await expect(cards).toHaveText([new RegExp(early), new RegExp(late)]);
    });

    await test.step("week 1 only", async () => {
      await page.getByRole("button", { name: /^Week 1\b/ }).click();
      await expect(page.getByRole("heading", { name: /^Week 1 Transactions/ })).toBeVisible();
      await expect(cards).toHaveText([new RegExp(early)]);
    });

    await test.step("week 2 only", async () => {
      await page.getByRole("button", { name: /^Week 2\b/ }).click();
      await expect(page.getByRole("heading", { name: /^Week 2 Transactions/ })).toBeVisible();
      await expect(cards).toHaveText([new RegExp(late)]);
    });

    await test.step("back to all weeks", async () => {
      await page.getByRole("button", { name: "All Weeks" }).click();
      await expect(
        page.getByRole("heading", { name: `All ${format(month, "MMMM")} Transactions` }),
      ).toBeVisible();
      await expect(cards).toHaveCount(2);
    });
  });

  test("should load more transactions on scroll", async ({ page }, testInfo) => {
    const prefix = `e2e-${testInfo.project.name}-${Math.random().toString(36).slice(2, 8)}`;
    const monthsBack = testInfo.project.name === "mobile" ? MAX_MONTHS_BACK - 2 : MAX_MONTHS_BACK - 1;
    const month = monthsAgo(monthsBack);
    const total = 12;

    for (let day = 1; day <= total; day++) {
      seededIds.push(
        await seedExpense(page.request, {
          category: `${prefix}-${day}`,
          amount: day,
          date: dayOf(month, day),
        }),
      );
    }

    await page.reload();
    await goBackMonths(page, monthsBack);
    const cards = transactionCards(page, prefix);
    await expect(cards.first()).toBeVisible();

    await expect(async () => {
      await page.locator("main").evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await expect(cards).toHaveCount(total, { timeout: 1000 });
    }).toPass();
  });
});
