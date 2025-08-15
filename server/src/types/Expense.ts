interface Expense {
  id: number;
  userId: number;
  category: string;
  description?: string | null | undefined;
  amount: number;
  date: Date;
}

export type { Expense };
