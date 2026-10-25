import { api, queryKeys } from "@/api";
import type { Period } from "@/types";
import { useQuery } from "@tanstack/react-query";

function useGetDailyChartsData({ month, year }: Period) {
  return useQuery({
    queryKey: queryKeys.dashboard.dailyCharts({ month, year }),
    queryFn: async () => {
      const response = await api.get("/dashboard/charts/daily", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

function useGetWeeklyChartsData({ month, year }: Period) {
  return useQuery({
    queryKey: queryKeys.dashboard.weeklyCharts({ month, year }),
    queryFn: async () => {
      const response = await api.get("/dashboard/charts/weekly", {
        params: { month, year },
      });
      return response.data.data;
    },
  });
}

export { useGetDailyChartsData, useGetWeeklyChartsData };
