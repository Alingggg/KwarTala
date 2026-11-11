import { test, expect, type Page } from "@playwright/test";
import { modal } from "./helpers/expense";

const API_URL = "http://localhost:3000/api";

async function openEditUsername(page: Page) {
  await page.getByRole("button", { name: "Edit username" }).click();
  await expect(modal(page).getByRole("heading", { name: "Edit Username" })).toBeVisible();
}

async function submitUsername(page: Page, value: string) {
  await modal(page).getByLabel("Username").fill(value);
  await modal(page).getByRole("button", { name: "Save Username" }).click();
}

test.describe("Edit Username", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
    await openEditUsername(page);
  });

  test("should display error message for an invalid username", async ({ page }) => {
    await submitUsername(page, "bad name!");
    await expect(modal(page).getByText("Username can only contain letters and numbers")).toBeVisible();
  });

  test("should update the username", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Mutates the shared test account, so it runs on one project only",
    );

    const original = await modal(page).getByLabel("Username").inputValue();
    const updated = `e2e${Math.random().toString(36).slice(2, 10)}`;

    try {
      await submitUsername(page, updated);
      await expect(modal(page).getByText("Username updated!")).toBeVisible();
      await modal(page).getByRole("button", { name: "Close" }).click();
      await expect(page.getByText(updated, { exact: true })).toBeVisible();

      await page.goto("/home");
      await expect(page.getByRole("heading", { name: new RegExp(`^Hello, ${updated}`) })).toBeVisible();
    } finally {
      await page.request.post(`${API_URL}/auth/change-username`, { data: { userName: original } });
    }
  });
});
