interface Expense {
  id: number;
  userId: number;
  category: string;
  description: string | null;
  amount: number;
  date: string;
}

type ExpenseListFilters = {
  startDate: string;
  endDate: string;
  limit: number;
  orderBy: "asc" | "desc";
};

export type { Expense, ExpenseListFilters };
