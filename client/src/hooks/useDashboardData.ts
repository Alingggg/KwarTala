import { api, queryKeys } from "@/api";
import type { Period } from "@/types";
import { useQuery } from "@tanstack/react-query";

function useGetHomeData() {
  return useQuery({
    queryKey: queryKeys.dashboard.home(),
    queryFn: async () => {
      const response = await api("/dashboard/home");
      return response.data.data;
    },
  });
}

function useGetMonthlyTransactionsSummary({ month, year }: Period) {
  return useQuery({
    queryKey: queryKeys.dashboard.transactionsSummary({ month, year }),
    queryFn: async () => {
      const response = await api("/dashboard/transactions/summary", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

function useGetAnalyticsData({ month, year }: Period) {
  return useQuery({
    queryKey: queryKeys.dashboard.analytics({ month, year }),
    queryFn: async () => {
      const response = await api("/dashboard/analytics", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

export {
  useGetHomeData,
  useGetMonthlyTransactionsSummary,
  useGetAnalyticsData,
};
