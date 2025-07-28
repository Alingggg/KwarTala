interface Expense {
  id: number;
  userId: number;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export type { Expense };
