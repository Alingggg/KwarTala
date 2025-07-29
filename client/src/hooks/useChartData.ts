import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

function useDailyChartsData({ month, year }: { month: number; year: number }) {
  return useQuery({
    queryKey: ["dailyChartsData", month, year],
    queryFn: async () => {
      const response = await api.get("/dashboard/charts/daily", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

function useWeeklyChartsData({ month, year }: { month: number; year: number }) {
  return useQuery({
    queryKey: ["weeklyChartsData", month, year],
    queryFn: async () => {
      const response = await api.get("/dashboard/charts/weekly", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

export { useDailyChartsData, useWeeklyChartsData };
