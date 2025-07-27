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

    // If requested month/year is current month/year
    if (today.getFullYear() === year && today.getMonth() === month - 1) {
      endDate = today;
    } else {
      // Previous month/year
      endDate = new Date(year, month, 0); // Last day of requested month
    }

    return expenseService.getTotalDailyExpenseInDateRange({
      userId,
      startDate,
      endDate,
    });
  },
};

export default chartDataService;
