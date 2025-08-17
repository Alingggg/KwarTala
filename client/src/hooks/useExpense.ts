import { api } from "@/api";
import type { Expense } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { isWithinInterval } from "date-fns";

function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addExpense"],
    mutationFn: async (expense: Omit<Expense, "id" | "userId">) => {
      const response = await api.post("/expenses", expense);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      const expenseDate = new Date(variables.date);
      const expenseMonthNumber = new Date(expenseDate).getMonth() + 1;
      const expenseYear = new Date(expenseDate).getFullYear();

      const today = new Date();
      const currentMonthNumber = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      queryClient.invalidateQueries({
        predicate: (query) => {
          if (query.queryKey[0] === "homeData") {
            return (
              expenseMonthNumber === currentMonthNumber &&
              expenseYear === currentYear
            );
          }

          if (query.queryKey[0] === "expenses") {
            const [, startDateStr, endDateStr] = query.queryKey as [
              "expenses",
              string,
              string,
              number,
              "desc" | "asc"
            ];

            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);

            return isWithinInterval(expenseDate, {
              start: startDate,
              end: endDate,
            });
          }

          if (
            query.queryKey[0] === "monthlyTransactionsSummaryData" ||
            query.queryKey[0] === "analyticsData" ||
            query.queryKey[0] === "dailyChartsData" ||
            query.queryKey[0] === "weeklyChartsData"
          ) {
            const [_, month, year] = query.queryKey as [
              (
                | "monthlyTransactionsSummaryData"
                | "analyticsData"
                | "dailyChartsData"
                | "weeklyChartsData"
              ),
              number,
              number
            ];

            return month === expenseMonthNumber && year === expenseYear;
          }

          return false;
        },
      });
    },
    onError: (error: any) => {
      console.error("Failed to add expense:", error?.response?.data?.message);
    },
  });
}

function useGetExpenses({
  startDate,
  endDate,
  limit,
  orderBy,
}: {
  startDate: string;
  endDate: string;
  limit: number;
  orderBy: "desc" | "asc";
}) {
  return useInfiniteQuery({
    queryKey: ["expenses", startDate, endDate, limit, orderBy],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/dashboard/transactions", {
        params: { startDate, endDate, page: pageParam, limit, orderBy },
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
      const expenseDate = variables.date;
      const expenseMonthNumber = new Date(expenseDate).getMonth() + 1;
      const expenseYear = new Date(expenseDate).getFullYear();

      const today = new Date();
      const currentMonthNumber = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      queryClient.invalidateQueries({
        predicate: (query) => {
          if (query.queryKey[0] === "homeData") {
            return (
              expenseMonthNumber === currentMonthNumber &&
              expenseYear === currentYear
            );
          }

          if (query.queryKey[0] === "expenses") {
            const [, startDateStr, endDateStr] = query.queryKey as [
              "expenses",
              string,
              string,
              number,
              "desc" | "asc"
            ];

            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);

            return isWithinInterval(expenseDate, {
              start: startDate,
              end: endDate,
            });
          }

          if (
            query.queryKey[0] === "monthlyTransactionsSummaryData" ||
            query.queryKey[0] === "analyticsData" ||
            query.queryKey[0] === "dailyChartsData" ||
            query.queryKey[0] === "weeklyChartsData"
          ) {
            const [_, month, year] = query.queryKey as [
              (
                | "monthlyTransactionsSummaryData"
                | "analyticsData"
                | "dailyChartsData"
                | "weeklyChartsData"
              ),
              number,
              number
            ];

            return month === expenseMonthNumber && year === expenseYear;
          }

          return false;
        },
      });
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
      const expenseDate = variables.date;
      const expenseMonthNumber = new Date(expenseDate).getMonth() + 1;
      const expenseYear = new Date(expenseDate).getFullYear();

      const today = new Date();
      const currentMonthNumber = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      queryClient.invalidateQueries({
        predicate: (query) => {
          if (query.queryKey[0] === "homeData") {
            return (
              expenseMonthNumber === currentMonthNumber &&
              expenseYear === currentYear
            );
          }

          if (query.queryKey[0] === "expenses") {
            const [, startDateStr, endDateStr] = query.queryKey as [
              "expenses",
              string,
              string,
              number,
              "desc" | "asc"
            ];

            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);

            return isWithinInterval(expenseDate, {
              start: startDate,
              end: endDate,
            });
          }

          if (
            query.queryKey[0] === "monthlyTransactionsSummaryData" ||
            query.queryKey[0] === "analyticsData" ||
            query.queryKey[0] === "dailyChartsData" ||
            query.queryKey[0] === "weeklyChartsData"
          ) {
            const [_, month, year] = query.queryKey as [
              (
                | "monthlyTransactionsSummaryData"
                | "analyticsData"
                | "dailyChartsData"
                | "weeklyChartsData"
              ),
              number,
              number
            ];

            return month === expenseMonthNumber && year === expenseYear;
          }

          return false;
        },
      });
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
