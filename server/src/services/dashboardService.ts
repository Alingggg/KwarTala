import {
  format,
  lastDayOfMonth,
  addDays,
  isAfter,
  differenceInCalendarDays,
} from "date-fns";
import { budgetService, expenseService } from "@/services/index";

const dashboardService = {
  async getHomeData(userId: number) {
    const today = new Date();
    const monthNumber = today.getMonth() + 1;
    const year = today.getFullYear();

    const startDate = format(new Date(year, today.getMonth(), 1), "yyyy-MM-dd");
    const endDate = format(lastDayOfMonth(today), "yyyy-MM-dd");

    const budget = await budgetService.getCurrentMonthBudget(userId);

    const spentToday = (await expenseService.getTotalSpentToday(userId)) ?? 0;

    const totalMonthlySpent = await expenseService.getTotalMonthlySpent({
      userId,
      startDate,
      endDate,
    });

    const remainingBudget =
      budget && budget.amount ? budget.amount - totalMonthlySpent : 0;

    const budgetUsedPercentage =
      budget && budget.amount > 0
        ? Math.round((totalMonthlySpent / budget.amount) * 100 * 100) / 100
        : 0;

    return {
      monthNumber,
      year,
      budget: budget?.amount ?? 0,
      remainingBudget,
      budgetUsedPercentage,
      spentToday,
    };
  },

  async getTransactionsSummary({
    userId,
    month,
    year,
  }: {
    userId: number;
    month: number;
    year: number;
  }) {
    const budget = await budgetService.getBudgetByUserIdAndDate({
      userId,
      month,
      year,
    });

    const startDateObj = new Date(year, month - 1, 1);
    const endDateObj = lastDayOfMonth(startDateObj);
    const startDate = format(startDateObj, "yyyy-MM-dd");
    const endDate = format(endDateObj, "yyyy-MM-dd");

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

    const daysInMonth = endDateObj.getDate();
    const dailyBudget = budget?.amount ? budget.amount / daysInMonth : 0;

    // Create weeks array with weekly spending data
    const weeks = [];
    const numberOfWeeks = Math.ceil(daysInMonth / 7);
    for (let weekNumber = 1; weekNumber <= numberOfWeeks; weekNumber++) {
      const weekStartDay = (weekNumber - 1) * 7 + 1;
      const weekEndDay = Math.min(weekNumber * 7, daysInMonth);
      const daysInWeek = weekEndDay - weekStartDay + 1;

      const weekStartDate = format(
        new Date(year, month - 1, weekStartDay),
        "yyyy-MM-dd"
      );
      const weekEndDate = format(
        new Date(year, month - 1, weekEndDay),
        "yyyy-MM-dd"
      );

      const weeklyBudget = Math.round(dailyBudget * daysInWeek * 100) / 100;

      const weekData = totalWeeklySpent.find(
        (_: any, index: number) => index + 1 === weekNumber
      );

      const weeklyTotalSpent = weekData
        ? Math.round((weekData as any).total * 100) / 100
        : 0;

      const weeklyRemainingBudget =
        Math.round((weeklyBudget - weeklyTotalSpent) * 100) / 100;

      weeks.push({
        weekNumber,
        weekStartDate,
        weekEndDate,
        weeklyBudget,
        weeklyTotalSpent,
        weeklyRemainingBudget,
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

  async getTransactions({
    userId,
    startDate,
    endDate,
    page,
    limit,
    orderBy,
  }: {
    userId: number;
    startDate: string;
    endDate: string;
    page: number;
    limit: number;
    orderBy: "desc" | "asc";
  }) {
    const expenses =
      await expenseService.getExpensesByUserIdAndDateRangeWithPageAndLimit({
        userId,
        startDate,
        endDate,
        page,
        limit,
        orderBy,
      });

    const numberOfExpenses =
      await expenseService.getNumberOfExpensesByUserIdAndDateRange({
        userId,
        startDate,
        endDate,
      });

    const totalPages = Math.ceil(numberOfExpenses / limit);

    const pagination = {
      currentPage: page,
      hasNextPage: page < totalPages,
    };

    return {
      transactions: expenses,
      pagination,
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
    const budget = await budgetService.getBudgetByUserIdAndDate({
      userId,
      month,
      year,
    });

    const startOfMonthObj = new Date(year, month - 1, 1);
    const endOfMonthObj = lastDayOfMonth(startOfMonthObj);
    const startOfMonth = format(startOfMonthObj, "yyyy-MM-dd");
    const endOfMonth = format(endOfMonthObj, "yyyy-MM-dd");

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

    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month;
    const dayToday = isCurrentMonth ? today.getDate() : endOfMonthObj.getDate();
    const lastDayOfMonthNum = endOfMonthObj.getDate();

    let remainingDays = 0;
    if (isCurrentMonth) {
      remainingDays = lastDayOfMonthNum - dayToday + 1;
    }

    const isPastMonth =
      year < today.getFullYear() ||
      (year === today.getFullYear() && month < today.getMonth() + 1);

    if (isPastMonth) {
      remainingDays = 0;
    }

    let averageDailySpending = 0;
    if (isCurrentMonth) {
      averageDailySpending = totalMonthlySpent / dayToday;
    } else {
      averageDailySpending = totalMonthlySpent / lastDayOfMonthNum;
    }

    const recommendedDailyLimit = isCurrentMonth
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
    const startDate = format(new Date(year, month - 1, 1), "yyyy-MM-dd");
    let endDate: string;

    if (today.getFullYear() === year && today.getMonth() === month - 1) {
      endDate = format(today, "yyyy-MM-dd");
    } else {
      endDate = format(lastDayOfMonth(startDate), "yyyy-MM-dd");
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
    const startDateObj = new Date(year, month - 1, 1);
    const endDateObj = lastDayOfMonth(startDateObj);
    const startDate = format(startDateObj, "yyyy-MM-dd");
    const endDate = format(endDateObj, "yyyy-MM-dd");

    const data = await expenseService.getTotalWeeklyExpenseInDateRange({
      userId,
      startDate: startDate,
      endDate: endDate,
    });

    const formattedData = data.map((item: any, idx: number) => {
      const weekStartDate = item.date;

      let weekEndDateObj = addDays(new Date(weekStartDate), 6);
      if (isAfter(weekEndDateObj, endDateObj)) {
        weekEndDateObj = endDateObj;
      }
      const weekEndDateString = format(weekEndDateObj, "yyyy-MM-dd");

      const days =
        differenceInCalendarDays(weekEndDateObj, new Date(weekStartDate)) + 1;

      const dailyAverage =
        days > 0 ? Number((item.total / days).toFixed(2)) : 0;

      return {
        weekNumber: idx + 1,
        weekStartDate,
        weekEndDate: weekEndDateString,
        total: item.total,
        days,
        dailyAverage,
      };
    });

    return formattedData;
  },
};

export default dashboardService;
