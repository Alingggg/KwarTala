interface Expense {
  id: number;
  userId: number;
  category: string;
  description: string;
  amount: number;
  date: string | Date;
}

export type { Expense };
