import { budgetRepository } from "@/repositories";
import type { Budget } from "@/types";

const budgetService = {
  async createBudget({ userId, month, year, amount }: Omit<Budget, "id">) {
    return budgetRepository.create({ userId, month, year, amount });
  },
  async findCurrentMonthBudgetByUserId({
    userId,
    month,
    year,
  }: Omit<Budget, "id" | "amount">) {
    return budgetRepository.findByUserIdAndDate({ userId, month, year });
  },
  async updateBudgetByUserIdAndDate({
    userId,
    month,
    year,
    amount,
  }: Omit<Budget, "id">) {
    return budgetRepository.updateByUserIdAndDate({
      userId,
      month,
      year,
      amount,
    });
  },
};

export default budgetService;
