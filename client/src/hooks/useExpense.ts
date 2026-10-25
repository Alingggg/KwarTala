import { api, queryKeys, type ExpenseListKey } from "@/api";
import type { Expense, ExpenseListFilters } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { isWithinInterval } from "date-fns";

function invalidateExpenseQueries(
  queryClient: QueryClient,
  date: Date | string
) {
  const expenseDate = new Date(date);
  const period = {
    month: expenseDate.getMonth() + 1,
    year: expenseDate.getFullYear(),
  };

  const today = new Date();
  if (
    period.month === today.getMonth() + 1 &&
    period.year === today.getFullYear()
  ) {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.home() });
  }

  queryClient.invalidateQueries({
    queryKey: queryKeys.expenses.lists(),
    predicate: (query) => {
      const [, , { startDate, endDate }] = query.queryKey as ExpenseListKey;

      return isWithinInterval(expenseDate, {
        start: new Date(startDate),
        end: new Date(endDate),
      });
    },
  });

  queryClient.invalidateQueries({
    queryKey: queryKeys.dashboard.month(period),
  });
}

function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addExpense"],
    mutationFn: async (expense: Omit<Expense, "id" | "userId">) => {
      const response = await api.post("/expenses", expense);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      invalidateExpenseQueries(queryClient, variables.date);
    },
    onError: (error: any) => {
      console.error("Failed to add expense:", error?.response?.data?.message);
    },
  });
}

function useGetExpenses(filters: ExpenseListFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.expenses.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/dashboard/transactions", {
        params: { ...filters, page: pageParam },
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    select: (data) => {
      const flatTransactions = data.pages.flatMap((page) => page.transactions);
      const uniqueTransactions = Array.from(
        new Map(flatTransactions.map((item) => [item.id, item])).values()
      );

      return {
        pages: [{ transactions: uniqueTransactions }],
        pageParams: data.pageParams,
      };
    },
  });
}

function useEditExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["editExpense"],
    mutationFn: async (expense: Omit<Expense, "userId">) => {
      const response = await api.put(`/expenses/${expense.id}`, expense);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      invalidateExpenseQueries(queryClient, variables.date);
    },
    onError: (error: any) => {
      console.error("Failed to edit expense:", error?.response?.data?.message);
    },
  });
}

function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteExpense"],
    mutationFn: async ({
      id,
      date: _date,
    }: {
      id: number;
      date: Date | string;
    }) => {
      const response = await api.delete(`/expenses/${id}`);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      invalidateExpenseQueries(queryClient, variables.date);
    },
    onError: (error: any) => {
      console.error(
        "Failed to delete expense:",
        error?.response?.data?.message
      );
    },
  });
}

export { useAddExpense, useGetExpenses, useEditExpense, useDeleteExpense };
