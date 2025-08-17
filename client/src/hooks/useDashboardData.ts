import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

function useGetHomeData() {
  return useQuery({
    queryKey: ["homeData"],
    queryFn: async () => {
      const response = await api("/dashboard/home");
      return response.data.data;
    },
  });
}

function useGetMonthlyTransactionsSummary({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  return useQuery({
    queryKey: ["monthlyTransactionsSummaryData", month, year],
    queryFn: async () => {
      const response = await api("/dashboard/transactions/summary", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

function useGetAnalyticsData({ month, year }: { month: number; year: number }) {
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

export {
  useGetHomeData,
  useGetMonthlyTransactionsSummary,
  useGetAnalyticsData,
};
