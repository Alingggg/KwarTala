import { expect, type Page } from "@playwright/test";
import { format, setDate, subMonths } from "date-fns";

export const MAX_MONTHS_BACK = 11;

export function monthsAgo(n: number) {
  return subMonths(new Date(), n);
}

export function dayOf(monthDate: Date, day: number) {
  return format(setDate(monthDate, day), "yyyy-MM-dd");
}

export async function goBackMonths(page: Page, n: number) {
  for (let i = 0; i < n; i++) {
    await page.getByRole("button", { name: "Previous month" }).click();
  }
  await expect(
    page.getByRole("heading", { level: 2, name: format(monthsAgo(n), "MMMM yyyy") }),
  ).toBeVisible();
}
