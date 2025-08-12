import { budgetRepository } from "@/repositories/index";
import type { Budget } from "@/types/index";

const budgetService = {
  async createBudget({ userId, month, year, amount }: Omit<Budget, "id">) {
    return budgetRepository.create({ userId, month, year, amount });
  },

  async getBudgetByUserIdAndDate({
    userId,
    month,
    year,
  }: Omit<Budget, "id" | "amount">) {
    let budget = await budgetRepository.getByUserIdAndDate({
      userId,
      month,
      year,
    });

    if (!budget) {
      budget = await budgetRepository.create({
        userId,
        month,
        year,
        amount: 0,
      });
    }

    return budget;
  },

  async getCurrentMonthBudget(userId: number) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    return budgetRepository.getByUserIdAndDate({
      userId,
      month,
      year,
    });
  },

  async updateBudgetByUserIdAndDate({
    userId,
    month,
    year,
    amount,
  }: Omit<Budget, "id">) {
    let budget = await budgetRepository.updateByUserIdAndDate({
      userId,
      month,
      year,
      amount,
    });

    if (!budget) {
      budget = await budgetRepository.create({ userId, month, year, amount });
    }

    return budget;
  },
};

export default budgetService;
