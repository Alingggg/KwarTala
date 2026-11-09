import type { Page } from "@playwright/test";

export function modal(page: Page) {
  return page.locator("#modal-root");
}

export function expenseCard(page: Page, category: string) {
  return page.getByRole("listitem").filter({ hasText: category });
}

export async function openCardAction(
  page: Page,
  category: string,
  action: "edit" | "delete",
  isMobile: boolean,
) {
  const card = expenseCard(page, category);
  if (isMobile) {
    await card.getByTitle("Options").click();
    await card.getByRole("button", { name: action === "edit" ? "Edit" : "Delete", exact: true }).click();
  } else {
    await card.getByTitle(action === "edit" ? "Edit expense" : "Delete expense").click();
  }
}
