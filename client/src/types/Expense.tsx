interface ExpenseNoId {
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface ExpenseWithId extends ExpenseNoId {
  id: number;
}

export type { ExpenseNoId, ExpenseWithId };
