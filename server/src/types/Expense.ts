interface Expense {
  id: number;
  userId: number;
  category: string;
  description: string | null;
  amount: number;
  date: string;
}

export type { Expense };
