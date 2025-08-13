interface Expense {
  id: number;
  userId: number;
  category: string;
  description: string | undefined;
  amount: number;
  date: string | Date;
}

export type { Expense };
