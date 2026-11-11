import { test, expect } from "@playwright/test";
import { expenseCard, modal, openCardAction } from "./helpers/expense";

test.describe("Expenses", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home");
  });

  test("should display error messages for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: "Add Expense" }).click();
    await modal(page).getByRole("button", { name: "Add Expense" }).click();
    await expect(modal(page).getByText("Category is required")).toBeVisible();
    await expect(modal(page).getByText("Amount must be a positive number")).toBeVisible();
  });

  test("should create, edit and delete an expense", async ({ page, isMobile }, testInfo) => {
    const category = `e2e-${testInfo.project.name}-${Math.random().toString(36).slice(2, 8)}`;
    const card = expenseCard(page, category);

    await test.step("create", async () => {
      await page.getByRole("button", { name: "Add Expense" }).click();
      const form = modal(page);
      await expect(form.getByRole("heading", { name: "Add Expense" })).toBeVisible();
      await form.getByRole("button", { name: "Use custom category" }).click();
      await form.getByRole("textbox", { name: /^Category/ }).fill(category);
      await form.getByLabel("Description").fill("e2e expense");
      await form.getByLabel("Amount").fill("123.45");
      await form.getByRole("button", { name: "Add Expense" }).click();

      await expect(form.getByRole("heading", { name: "Add Expense" })).toBeHidden();
      await expect(card).toContainText("₱123.45");
    });

    await test.step("edit", async () => {
      await openCardAction(page, category, "edit", isMobile);
      const form = modal(page);
      await expect(form.getByRole("heading", { name: "Edit Expense" })).toBeVisible();
      await expect(form.getByRole("textbox", { name: /^Category/ })).toHaveValue(category);
      await expect(form.getByLabel("Amount")).toHaveValue("123.45");
      await form.getByLabel("Amount").fill("67.89");
      await form.getByRole("button", { name: "Save Changes" }).click();

      await expect(form.getByRole("heading", { name: "Edit Expense" })).toBeHidden();
      await expect(card).toContainText("₱67.89");
    });

    await test.step("delete", async () => {
      await openCardAction(page, category, "delete", isMobile);
      const confirm = modal(page);
      await expect(confirm.getByRole("heading", { name: "Delete Expense" })).toBeVisible();
      await expect(confirm).toContainText(category);
      await confirm.getByRole("button", { name: "Delete", exact: true }).click();

      await expect(confirm.getByRole("heading", { name: "Delete Expense" })).toBeHidden();
      await expect(card).toHaveCount(0);
    });
  });
});
