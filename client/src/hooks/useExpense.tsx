import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";

function useAddExpense() {
  return useMutation({
    mutationKey: ["addExpense"],
    mutationFn: async (expenseData: {
      category: string;
      description: string;
      amount: number;
      date: string;
    }) => {
      const response = await api.post("/expenses", expenseData);
      return response.data.data;
    },
    onError: (error: any) => {
      console.error("Failed to add expense:", error?.response?.data?.message);
    },
  });
}

function useEditExpense() {
  return useMutation({
    mutationKey: ["editExpense"],
    mutationFn: async (expenseData: {
      id: number;
      category: string;
      description: string;
      amount: number;
      date: string;
    }) => {
      const response = await api.put(
        `/expenses/${expenseData.id}`,
        expenseData
      );
      return response.data.data;
    },
    onError: (error: any) => {
      console.error("Failed to edit expense:", error?.response?.data?.message);
    },
  });
}

function useDeleteExpense() {
  return useMutation({
    mutationKey: ["deleteExpense"],
    mutationFn: async (id: number) => {
      const response = await api.delete(`/expenses/${id}`);
      return response.data.data;
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
