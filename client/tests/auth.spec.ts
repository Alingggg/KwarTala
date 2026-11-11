import { test, expect } from "@playwright/test";
import { authFile, loggedOut, login } from "./helpers/auth";

test.use({ storageState: loggedOut });

test.describe("Login form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should fail to login with invalid credentials", async ({ page }) => {
    await page.getByLabel("email").fill("invalid-email@example.com");
    await page.getByLabel("password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: /^Hello, / })).toBeVisible();
  });
});

test.describe("Route guards", () => {
  test("should redirect logged-out users from /home to /login", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL("/login");
  });

  test("should return to /login after logging out", async ({ page }) => {
    await login(page);
    await page.goto("/settings");
    await page.getByRole("button", { name: "Log Out" }).click();
    await expect(page).toHaveURL("/login");
  });

  test.describe("when logged in", () => {
    test.use({ storageState: authFile });

    test("should redirect logged-in users from /login to /home", async ({ page }) => {
      await page.goto("/login");
      await expect(page).toHaveURL("/home");
    });
  });
});
