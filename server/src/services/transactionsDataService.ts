import { budgetService, expenseService } from "@/services";
import { Expense } from "@/types";

const transactionsDataService = {
  async getMonthlyTransactions({
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

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

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
        (_, index) => index + 1 === weekNumber
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
      month: new Date(year, month - 1).toLocaleString("en-US", {
        month: "long",
      }),
      year,
      monthlyBudget: Math.round((budget?.amount ?? 0) * 100) / 100,
      monthlyTotalSpent: Math.round(monthlyTotalSpent * 100) / 100,
      monthlyRemainingBudget: Math.round(monthlyRemainingBudget * 100) / 100,
      weeks,
    };
  },
};

export default transactionsDataService;
