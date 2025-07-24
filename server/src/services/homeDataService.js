import { budgetService, expenseService } from "#services";

const homeDataService = {
  async getHomeData(userId) {
    if (!userId) {
      const error = new Error("User ID is required");
      error.statusCode = 400;
      throw error;
    }

    const today = new Date();
    const monthNumber = today.getMonth() + 1;
    const year = today.getFullYear();

    let budget = await budgetService.findCurrentMonthBudgetByUserId({
      userId,
      month: monthNumber,
      year,
    });

    if (budget === undefined || budget === null) {
      budget = await budgetService.createBudget({
        month: monthNumber,
        year,
        amount: 0,
      });
    }

    const spentToday = (await expenseService.getTotalSpentToday(userId)) ?? 0;

    const remainingBudget = budget.amount - spentToday;

    const budgetUsedPercentage =
      budget.amount > 0
        ? Math.round((spentToday / budget.amount) * 100 * 100) / 100
        : 0;

    const todaysTransactions = await expenseService.getTodaysTransactions(
      userId
    );

    return {
      month: today.toLocaleString("en-US", { month: "long" }),
      year,
      budget: budget.amount,
      remainingBudget,
      budgetUsedPercentage,
      spentToday,
      todaysTransactions,
    };
  },
};

export default homeDataService;
