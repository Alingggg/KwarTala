import { budgetService, expenseService } from "@/services/index";
import type { CustomError, Expense } from "@/types/index";

const dashboardService = {
  async getHomeData(userId: number) {
    if (!userId) {
      const error: CustomError = new Error("User ID is required");
      error.statusCode = 400;
      throw error;
    }

    const today = new Date();
    const monthNumber = today.getMonth() + 1;
    const year = today.getFullYear();

    const startOfMonth = new Date(Date.UTC(year, today.getMonth(), 1));
    const endOfMonth = new Date(Date.UTC(year, today.getMonth() + 1, 0));

    const budget = await budgetService.findBudgetByUserIdAndDate({
      userId,
      month: monthNumber,
      year,
    });

    const spentToday = (await expenseService.getTotalSpentToday(userId)) ?? 0;

    const totalMonthlySpent = await expenseService.getTotalMonthlySpent({
      userId,
      startDate: startOfMonth,
      endDate: endOfMonth,
    });

    const remainingBudget =
      budget && budget.amount ? budget.amount - totalMonthlySpent : 0;

    const budgetUsedPercentage =
      budget && budget.amount > 0
        ? Math.round((totalMonthlySpent / budget.amount) * 100 * 100) / 100
        : 0;

    const todaysTransactions = await expenseService.getTodaysTransactions(
      userId
    );

    return {
      monthNumber,
      year,
      budget: budget?.amount ?? 0,
      remainingBudget,
      budgetUsedPercentage,
      spentToday,
      todaysTransactions,
    };
  },

  async getMonthlyTransactions({
    userId,
    month,
    year,
  }: {
    userId: number;
    month: number;
    year: number;
  }) {
    const budget = await budgetService.findBudgetByUserIdAndDate({
      userId,
      month,
      year,
    });

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));

    const monthlyTotalSpent = await expenseService.getTotalMonthlySpent({
      userId,
      startDate,
      endDate,
    });

    const monthlyRemainingBudget =
      budget && budget.amount ? budget.amount - monthlyTotalSpent : 0;

    const totalWeeklySpent =
      await expenseService.getTotalWeeklyExpenseInDateRange({
        userId,
        startDate,
        endDate,
      });

    const allMonthlyTransactions =
      await expenseService.getExpensesByUserIdAndDateRange({
        userId,
        startDate,
        endDate,
      });

    function getWeekNumber(date: Date): number {
      const dayOfMonth = date.getDate();
      return Math.ceil(dayOfMonth / 7);
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyBudget = budget?.amount ? budget.amount / daysInMonth : 0;

    // Group transactions by week
    const transactionsByWeek: { [key: number]: Expense[] } = {};
    allMonthlyTransactions.forEach((transaction: Expense | null) => {
      if (!transaction) return;

      const transactionDate = new Date(transaction.date);
      const weekNumber = getWeekNumber(transactionDate);

      if (!transactionsByWeek[weekNumber]) {
        transactionsByWeek[weekNumber] = [];
      }

      transactionsByWeek[weekNumber].push({
        id: transaction.id,
        userId: transaction.userId,
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
      });
    });

    // Create weeks array with weekly spending data
    const weeks = [];
    const numberOfWeeks = Math.ceil(daysInMonth / 7);
    for (let weekNumber = 1; weekNumber <= numberOfWeeks; weekNumber++) {
      const weekStartDay = (weekNumber - 1) * 7 + 1;
      const weekEndDay = Math.min(weekNumber * 7, daysInMonth);
      const daysInWeek = weekEndDay - weekStartDay + 1;

      const weeklyBudget = Math.round(dailyBudget * daysInWeek * 100) / 100;

      const weekData = totalWeeklySpent.find(
        (_: any, index: number) => index + 1 === weekNumber
      );

      const weeklyTotalSpent = weekData
        ? Math.round(weekData.total * 100) / 100
        : 0;

      const weeklyRemainingBudget =
        Math.round((weeklyBudget - weeklyTotalSpent) * 100) / 100;

      const transactions = (transactionsByWeek[weekNumber] || []).map(
        (transaction) => ({
          ...transaction,
          amount: Math.round(transaction.amount * 100) / 100,
        })
      );

      weeks.push({
        weekNumber,
        weeklyBudget: Math.round(weeklyBudget * 100) / 100,
        weeklyTotalSpent,
        weeklyRemainingBudget,
        transactions,
      });
    }

    return {
      monthNumber: month,
      year,
      monthlyBudget: Math.round((budget?.amount ?? 0) * 100) / 100,
      monthlyTotalSpent: Math.round(monthlyTotalSpent * 100) / 100,
      monthlyRemainingBudget: Math.round(monthlyRemainingBudget * 100) / 100,
      weeks,
    };
  },

  async getAnalyticsData({
    userId,
    month,
    year,
  }: {
    userId: number;
    month: number;
    year: number;
  }) {
    const budget = await budgetService.findBudgetByUserIdAndDate({
      userId,
      month,
      year,
    });

    const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const endOfMonth = new Date(Date.UTC(year, month, 0));

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

    const finalExpenseByCategory = expenseByCategory.map((category: any) => ({
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
      monthNumber: month,
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
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    let endDate;

    if (today.getFullYear() === year && today.getMonth() === month - 1) {
      endDate = today;
    } else {
      endDate = new Date(Date.UTC(year, month, 0));
    }

    const data = await expenseService.getTotalDailyExpenseInDateRange({
      userId,
      startDate,
      endDate,
    });

    return data;
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
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));

    const data = await expenseService.getTotalWeeklyExpenseInDateRange({
      userId,
      startDate,
      endDate,
    });

    const formattedData = data.map((item: any, idx: number, arr: any[]) => {
      const weekStartDate = new Date(item.date);
      let weekEndDate = new Date(weekStartDate);
      weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 6);
      if (weekEndDate > endDate) {
        weekEndDate = endDate;
      }

      const days =
        Math.ceil(
          (weekEndDate.getTime() - weekStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      const dailyAverage =
        days > 0 ? Number((item.total / days).toFixed(2)) : 0;

      return {
        weekNumber: idx + 1,
        weekStartDate: weekStartDate.toISOString().split("T")[0],
        weekEndDate: weekEndDate.toISOString().split("T")[0],
        total: item.total,
        days,
        dailyAverage,
      };
    });

    return formattedData;
  },
};

export default dashboardService;
