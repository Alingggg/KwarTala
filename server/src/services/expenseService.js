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

  async findExpensesByDate(date) {
    return expenseRepository.findByDate(date);
  },

  async findExpensesByDateAndCategory(date, category) {
    return expenseRepository.findByDateAndCategory(date, category);
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
