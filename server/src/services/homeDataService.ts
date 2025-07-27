import { budgetService, expenseService } from "@/services";
import type { CustomError } from "@/types";

const homeDataService = {
  async getHomeData(userId: number) {
    if (!userId) {
      const error: CustomError = new Error("User ID is required");
      error.statusCode = 400;
      throw error;
    }

    const today = new Date();
    const monthNumber = today.getMonth() + 1;
    const year = today.getFullYear();

    function formatDate(date: Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    const startOfMonth = formatDate(new Date(year, today.getMonth(), 1));
    const endOfMonth = formatDate(new Date(year, today.getMonth() + 1, 0));

    let budget = await budgetService.findCurrentMonthBudgetByUserId({
      userId,
      month: monthNumber,
      year,
    });

    if (!budget) {
      budget = await budgetService.createBudget({
        userId,
        month: monthNumber,
        year,
        amount: 0,
      });
    }

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
      month: today.toLocaleString("en-US", { month: "long" }),
      year,
      budget: budget?.amount ?? 0,
      remainingBudget,
      budgetUsedPercentage,
      spentToday,
      todaysTransactions,
    };
  },
};

export default homeDataService;
