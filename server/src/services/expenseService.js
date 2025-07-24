import { expenseRepository } from "#repositories";

const expenseService = {
  async createExpense({ userId, category, description, amount, date }) {
    return expenseRepository.create({
      userId,
      category,
      description,
      amount,
      date,
    });
  },

  async getTodaysTransactions(userId) {
    const date = new Date();
    return expenseRepository.findByUserIdAndDateRange({
      userId,
      startDate: date,
      endDate: date,
    });
  },

  async getTotalSpentToday(userId) {
    const date = new Date();
    return expenseRepository.getTotalExpensesAmountByUserIdAndDateRange({
      userId,
      startDate: date,
      endDate: date,
    });
  },

  async updateExpense({ id, category, description, amount, date }) {
    return expenseRepository.update({
      id,
      category,
      description,
      amount,
      date,
    });
  },

  async deleteExpense(id) {
    return expenseRepository.delete(id);
  },
};

export default expenseService;
