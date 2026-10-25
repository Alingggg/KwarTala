import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DASHBOARD_QUERY_KEYS = [
  "homeData",
  "expenses",
  "budget",
  "monthlyTransactionsSummaryData",
  "analyticsData",
  "dailyChartsData",
  "weeklyChartsData",
];

function useSendMessage() {
  const queryClient = useQueryClient();

  const refreshDashboard = () =>
    queryClient.invalidateQueries({
      predicate: (query) =>
        DASHBOARD_QUERY_KEYS.includes(query.queryKey[0] as string),
    });

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
