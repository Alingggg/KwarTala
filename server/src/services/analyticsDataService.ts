import { budgetService, expenseService } from "@/services";

const analyticsDataService = {
  async getAnalyticsData({
    userId,
    month,
    year,
  }: {
    userId: number;
    month: number;
    year: number;
  }) {
    const budget = await budgetService.findCurrentMonthBudgetByUserId({
      userId,
      month,
      year,
    });

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const totalMonthlySpent = await expenseService.getTotalMonthlySpent({
      userId,
      startDate: startOfMonth,
      endDate: endOfMonth,
    });

    const monthlyRemainingBudget =
      budget && budget.amount ? budget.amount - totalMonthlySpent : 0;

    const monthlyBudgetUsedPercentage =
      budget && budget.amount > 0
        ? Math.round((totalMonthlySpent / budget.amount) * 100 * 100) / 100
        : 0;

    const lastDayOfMonth = endOfMonth.getDate();
    const averageDailySpending =
      totalMonthlySpent / (lastDayOfMonth - startOfMonth.getDate() + 1);

    const today = new Date();
    const dateToday = today.getDate();
    const remainingDays = lastDayOfMonth - dateToday + 1;

    const recommendedDailyLimit =
      remainingDays > 0
        ? Math.round((monthlyRemainingBudget / remainingDays) * 100) / 100
        : 0;

    const expenseByCategory = await expenseService.getTotalSpentPerCategory({
      userId,
      startDate: startOfMonth,
      endDate: endOfMonth,
    });

    const finalExpenseByCategory = expenseByCategory.map((category) => ({
      ...category,
      percentageOfTotal:
        Math.round((category.total / totalMonthlySpent) * 100 * 100) / 100,
    }));

    const highestExpenses = await expenseService.getHighestExpenses({
      userId,
      startDate: startOfMonth,
      endDate: endOfMonth,
      limit: 6,
    });

    return {
      month: new Date(year, month - 1).toLocaleString("en-US", {
        month: "long",
      }),
      year,
      monthlyBudget: Math.round((budget?.amount ?? 0) * 100) / 100,
      monthlyTotalSpent: Math.round(totalMonthlySpent * 100) / 100,
      monthlyRemainingBudget: Math.round(monthlyRemainingBudget * 100) / 100,
      monthlyBudgetUsedPercentage,
      averageDailySpending: Math.round(averageDailySpending * 100) / 100,
      recommendedDailyLimit: Math.round(recommendedDailyLimit * 100) / 100,
      remainingDays,
      expenseByCategory: finalExpenseByCategory,
      highestExpenses,
    };
  },
};

export default analyticsDataService;
