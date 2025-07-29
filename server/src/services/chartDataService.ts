import { expenseService } from "@/services";

const chartDataService = {
  async getDailyChartData({
    userId,
    month,
    year,
  }: {
    userId: number;
    month: number;
    year: number;
  }) {
    const today = new Date();
    const requestedMonthStart = new Date(year, month - 1, 1);
    const startDate = requestedMonthStart;
    let endDate;

    if (today.getFullYear() === year && today.getMonth() === month - 1) {
      endDate = today;
    } else {
      endDate = new Date(year, month, 0);
    }

    const data = await expenseService.getTotalDailyExpenseInDateRange({
      userId,
      startDate,
      endDate,
    });

    const formattedData = data.map((item: any) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
      }),
    }));

    return formattedData;
  },

  async getWeeklyChartData({
    userId,
    month,
    year,
  }: {
    userId: number;
    month: number;
    year: number;
  }) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const data = await expenseService.getTotalWeeklyExpenseInDateRange({
      userId,
      startDate,
      endDate,
    });

    const formattedData = data.map((item: any, idx: number, arr: any[]) => {
      const weekStart = new Date(item.date);
      const weekEnd =
        idx < arr.length - 1 ? new Date(arr[idx + 1].date) : endDate;

      const days =
        Math.ceil(
          (weekEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)
        ) || 1;

      const dateRange = `${weekStart.toLocaleString(undefined, {
        month: "short",
      })}. ${weekStart.getDate()}-${weekEnd.getDate()}`;

      return {
        name: `Week ${idx + 1}`,
        dateRange,
        total: item.total,
        days,
        dailyAverage: days > 0 ? Number((item.total / days).toFixed(2)) : 0,
      };
    });

    return formattedData;
  },
};

export default chartDataService;
