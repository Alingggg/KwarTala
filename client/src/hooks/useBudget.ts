import { api } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetBudget({ month, year }: { month: number; year: number }) {
  return useQuery({
    queryKey: ["budget", month, year],
    queryFn: async () => {
      const response = await api.get("/budgets", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

function useEditBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      month,
      year,
      budget,
    }: {
      month: number;
      year: number;
      budget: number;
    }) => {
      const response = await api.put(
        `/budgets`,
        {
          amount: budget,
        },
        { params: { month, year } }
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      const today = new Date();
      const currentMonthNumber = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      const budgetMonthNumber = variables.month;
      const budgetYear = variables.year;

      queryClient.invalidateQueries({
        predicate: (query) => {
          if (query.queryKey[0] === "homeData") {
            return (
              budgetMonthNumber === currentMonthNumber &&
              budgetYear === currentYear
            );
          }

          if (query.queryKey[0] === "expenses") {
            const [, startDateStr] = query.queryKey as [
              "expenses",
              string,
              string,
              number,
              "desc" | "asc"
            ];

            const startDate = new Date(startDateStr);

            const queryMonthNumber = startDate.getMonth() + 1;
            const queryYear = startDate.getFullYear();

            return (
              queryMonthNumber === budgetMonthNumber && queryYear === budgetYear
            );
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

            return month === budgetMonthNumber && year === budgetYear;
          }

          return false;
        },
      });
    },
  });
}

export { useEditBudget, useGetBudget };
