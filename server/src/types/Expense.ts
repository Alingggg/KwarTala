interface Expense {
  id: number;
  userId: number;
  category: string;
  description: string | undefined;
  amount: number;
  date: Date | string;
}

export type { Expense };
