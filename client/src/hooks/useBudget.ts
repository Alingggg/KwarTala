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

      if (
        variables.month === currentMonthNumber &&
        variables.year === currentYear
      ) {
        queryClient.invalidateQueries({
          queryKey: ["homeData"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["transactionsData", variables.month, variables.year],
      });

      queryClient.invalidateQueries({
        queryKey: ["analyticsData", variables.month, variables.year],
      });
    },
  });
}

export { useEditBudget, useGetBudget };
