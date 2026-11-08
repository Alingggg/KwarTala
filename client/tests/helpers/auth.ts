import { expect, type Page } from "@playwright/test";

export const authFile = "playwright/.auth/user.json";

export const loggedOut = { cookies: [], origins: [] };

const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;
if (!email || !password) {
  throw new Error("Set TEST_EMAIL and TEST_PASSWORD in .env.test");
}

export async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("email").fill(email!);
  await page.getByLabel("password").fill(password!);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL("/home");
}
