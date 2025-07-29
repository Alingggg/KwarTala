import { expenseRepository } from "@/repositories";
import type { Expense } from "@/types";

const expenseService = {
  async createExpense({
    userId,
    category,
    description,
    amount,
    date,
  }: Omit<Expense, "id">) {
    return expenseRepository.create({
      userId,
      category,
      description,
      amount,
      date,
    });
  },

  async getExpensesByUserIdAndDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    return expenseRepository.findByUserIdAndDateRange({
      userId,
      startDate,
      endDate,
    });
  },

  async getTodaysTransactions(userId: number) {
    const date = new Date();
    return expenseRepository.findByUserIdAndDateRange({
      userId,
      startDate: date,
      endDate: date,
    });
  },

  async getTotalSpentToday(userId: number) {
    const date = new Date();
    return expenseRepository.getTotalExpensesAmountByUserIdAndDateRange({
      userId,
      startDate: date,
      endDate: date,
    });
  },

  async getTotalMonthlySpent({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    return expenseRepository.getTotalExpensesAmountByUserIdAndDateRange({
      userId,
      startDate,
      endDate,
    });
  },

  async getTotalDailyExpenseInDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    return expenseRepository.getTotalDailyExpensesByUserIdAndDateRange({
      userId,
      startDate,
      endDate,
    });
  },

  async getTotalWeeklyExpenseInDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    return expenseRepository.getTotalWeeklyExpensesByUserIdAndDateRange({
      userId,
      startDate,
      endDate,
    });
  },

  async getHighestExpenses({
    userId,
    startDate,
    endDate,
    limit,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
    limit: number;
  }) {
    return expenseRepository.getHighestExpensesByUserIdAndDateRange({
      userId,
      startDate,
      endDate,
      limit,
    });
  },

  async getTotalSpentPerCategory({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    return expenseRepository.getTotalSpentPerCategory({
      userId,
      startDate,
      endDate,
    });
  },

  async updateExpense({
    id,
    category,
    description,
    amount,
    date,
  }: Omit<Expense, "userId">) {
    return expenseRepository.update({
      id,
      category,
      description,
      amount,
      date,
    });
  },

  async deleteExpense(id: number) {
    return expenseRepository.delete(id);
  },
};

export default expenseService;
