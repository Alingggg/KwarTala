interface Expense {
  id: number;
  userId: number;
  category: string;
  description: string;
  amount: number;
  date: string;
}

type ExpenseWithoutId = Omit<Expense, "id">;
type ExpenseWithoutUserId = Omit<Expense, "userId">;
type ExpenseWithoutIdAndUserId = Omit<Expense, "id" | "userId">;

export type {
  Expense,
  ExpenseWithoutId,
  ExpenseWithoutUserId,
  ExpenseWithoutIdAndUserId,
};
