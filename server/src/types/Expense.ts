interface Expense {
  id: number;
  userId: number;
  category: string;
  description: string;
  amount: number;
  date: Date | string;
}

export type { Expense };
