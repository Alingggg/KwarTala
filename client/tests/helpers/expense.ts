import { expect, type APIRequestContext, type Page } from "@playwright/test";

const API_URL = "http://localhost:3000/api";

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

type NewExpense = {
  category: string;
  amount: number;
  date: string;
  description?: string;
};

export async function seedExpense(request: APIRequestContext, expense: NewExpense) {
  const res = await request.post(`${API_URL}/expenses`, {
    data: { description: "", ...expense },
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  return body.data.id as number;
}

export async function deleteExpense(request: APIRequestContext, id: number) {
  await request.delete(`${API_URL}/expenses/${id}`);
}
