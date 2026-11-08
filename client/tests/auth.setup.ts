import { test as setup } from "@playwright/test";
import { authFile, login } from "./helpers/auth";

setup("authenticate", async ({ page }) => {
  await login(page);
  await page.context().storageState({ path: authFile });
});
