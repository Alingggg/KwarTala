import { api, queryKeys, type ExpenseListKey } from "@/api";
import type { Period } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseISO } from "date-fns";

function useGetBudget({ month, year }: Period) {
  return useQuery({
    queryKey: queryKeys.budget.month({ month, year }),
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
    }: Period & { budget: number }) => {
      const response = await api.put(
        `/budgets`,
        {
          amount: budget,
        },
        { params: { month, year } }
      );
      return response.data.data;
    },
    onSuccess: (_, { month, year }) => {
      const today = new Date();
      if (month === today.getMonth() + 1 && year === today.getFullYear()) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.home(),
        });
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.lists(),
        predicate: (query) => {
          const [, , { startDate }] = query.queryKey as ExpenseListKey;
          const queryStartDate = parseISO(startDate);

          return (
            queryStartDate.getMonth() + 1 === month &&
            queryStartDate.getFullYear() === year
          );
        },
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.month({ month, year }),
      });
    },
  });
}

export { useEditBudget, useGetBudget };
