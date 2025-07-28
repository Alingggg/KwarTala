import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

function useHomeData() {
  return useQuery({
    queryKey: ["homeData"],
    queryFn: async () => {
      const response = await api("/dashboard/home");
      return response.data.data;
    },
  });
}

function useTransactionsData({ month, year }: { month: number; year: number }) {
  return useQuery({
    queryKey: ["transactionsData", month, year],
    queryFn: async () => {
      const response = await api("/dashboard/transactions", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

function useAnalyticsData({ month, year }: { month: number; year: number }) {
  return useQuery({
    queryKey: ["analyticsData", month, year],
    queryFn: async () => {
      const response = await api("/dashboard/analytics", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

export { useHomeData, useTransactionsData, useAnalyticsData };
