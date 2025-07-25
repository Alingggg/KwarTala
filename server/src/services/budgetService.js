import { budgetRepository } from "#repositories";

const budgetService = {
  async createBudget({ userId, month, year, amount }) {
    return budgetRepository.create({ userId, month, year, amount });
  },
  async findCurrentMonthBudgetByUserId({ userId, month, year }) {
    return budgetRepository.findByUserIdAndDate({ userId, month, year });
  },
  async updateBudgetByUserIdAndDate({ userId, month, year, amount }) {
    return budgetRepository.updateByUserIdAndDate({
      userId,
      month,
      year,
      amount,
    });
  },
};

export default budgetService;
