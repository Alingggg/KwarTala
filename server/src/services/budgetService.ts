import { budgetRepository } from "@/repositories/index";
import type { Budget } from "@/types/index";

const budgetService = {
  async createBudget({ userId, month, year, amount }: Omit<Budget, "id">) {
    return budgetRepository.create({ userId, month, year, amount });
  },

  async findBudgetByUserIdAndDate({
    userId,
    month,
    year,
  }: Omit<Budget, "id" | "amount">) {
    let budget = await budgetRepository.findByUserIdAndDate({
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
