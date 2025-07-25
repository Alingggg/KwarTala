import { api } from "@/api";
import type { ExpenseNoId, ExpenseWithId } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addExpense"],
    mutationFn: async (expenseData: ExpenseNoId) => {
      const response = await api.post("/expenses", expenseData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeData"] });
    },
    onError: (error: any) => {
      console.error("Failed to add expense:", error?.response?.data?.message);
    },
  });
}

function useEditExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["editExpense"],
    mutationFn: async (expenseData: ExpenseWithId) => {
      const response = await api.put(
        `/expenses/${expenseData.id}`,
        expenseData
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeData"] });
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
    mutationFn: async (id: number) => {
      const response = await api.delete(`/expenses/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeData"] });
    },
    onError: (error: any) => {
      console.error(
        "Failed to delete expense:",
        error?.response?.data?.message
      );
    },
  });
}

export { useAddExpense, useEditExpense, useDeleteExpense };
