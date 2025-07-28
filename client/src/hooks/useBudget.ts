import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    onSuccess: (data) => {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      if (data.month === currentMonth && data.year === currentYear) {
        queryClient.invalidateQueries({
          queryKey: ["homeData"],
        });
      }
    },
  });
}

export default useEditBudget;
