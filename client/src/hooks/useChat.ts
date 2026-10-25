import { api, queryKeys } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useSendMessage() {
  const queryClient = useQueryClient();

  const refreshDashboard = () => {
    [
      queryKeys.dashboard.all,
      queryKeys.expenses.all,
      queryKeys.budget.all,
    ].forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
  };

  return useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async ({
      message,
      currency,
    }: {
      message: string;
      currency: string;
    }): Promise<{ reply: string; dataChanged: boolean }> => {
      const response = await api.post("/chat", { message, currency });
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data.dataChanged) refreshDashboard();
    },
    onError: (error: any) => {
      refreshDashboard();
      console.error("Failed to send message:", error?.response?.data?.message);
    },
  });
}

function useClearChat() {
  return useMutation({
    mutationKey: ["clearChat"],
    mutationFn: async () => {
      await api.delete("/chat");
    },
    onError: (error: any) => {
      console.error("Failed to clear chat:", error?.response?.data?.message);
    },
  });
}

export { useSendMessage, useClearChat };
