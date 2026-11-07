import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test.describe("Login Page",  () => {

    test("should display the login form", async ({ page }) => {
        await expect(page.getByLabel("email")).toBeVisible();
        await expect(page.getByLabel("password")).toBeVisible();
    })

    test("should display error messages for empty fields", async ({ page }) => {
        await page.getByRole("button", { name: "Sign In" }).click();
        await expect(page.getByText("Email is required")).toBeVisible();
        await expect(page.getByText("Password is required")).toBeVisible();
    })

    test("should display error message for invalid email format", async ({ page }) => {
        await page.getByLabel("email").fill("invalid-email");
        await page.getByLabel("password").fill("password123");
        await page.getByRole("button", { name: "Sign In" }).click();
        await expect(page.getByText("Invalid email format")).toBeVisible();
    })

    test("should fail to login with invalid credentials", async ({ page }) => {
        await page.getByLabel("email").fill("invalid-email@example.com");
        await page.getByLabel("password").fill("wrongpassword");
        await page.getByRole("button", { name: "Sign In" }).click();
        await expect(page.getByText("Invalid email or password")).toBeVisible();
    })

    test("should login successfully with valid credentials", async ({ page }) => {
        await page.getByLabel("email").fill(process.env.TEST_EMAIL!);
        await page.getByLabel("password").fill(process.env.TEST_PASSWORD!);
        await page.getByRole("button", { name: "Sign In" }).click();
        await expect(page).toHaveURL("/home");
    })
})