import type { ExpenseListFilters, Period } from "@/types";

const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
    hasToReLogIn: () => [...queryKeys.auth.all, "hasToReLogIn"] as const,
  },
  expenses: {
    all: ["expenses"] as const,
    lists: () => [...queryKeys.expenses.all, "list"] as const,
    list: (filters: ExpenseListFilters) =>
      [...queryKeys.expenses.lists(), filters] as const,
  },
  budget: {
    all: ["budget"] as const,
    month: (period: Period) => [...queryKeys.budget.all, period] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    home: () => [...queryKeys.dashboard.all, "home"] as const,
    months: () => [...queryKeys.dashboard.all, "month"] as const,
    month: (period: Period) =>
      [...queryKeys.dashboard.months(), period] as const,
    transactionsSummary: (period: Period) =>
      [...queryKeys.dashboard.month(period), "transactionsSummary"] as const,
    analytics: (period: Period) =>
      [...queryKeys.dashboard.month(period), "analytics"] as const,
    dailyCharts: (period: Period) =>
      [...queryKeys.dashboard.month(period), "dailyCharts"] as const,
    weeklyCharts: (period: Period) =>
      [...queryKeys.dashboard.month(period), "weeklyCharts"] as const,
  },
};

type ExpenseListKey = ReturnType<typeof queryKeys.expenses.list>;

export { queryKeys };
export type { ExpenseListKey };
