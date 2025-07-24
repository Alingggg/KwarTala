import { budgetRepository } from "#repositories";

const budgetService = {
  async createBudget({ month, year, amount }) {
    return budgetRepository.create({ month, year, amount });
  },
  async findBudgetByMonth({ month, year }) {
    return budgetRepository.findByMonth({ month, year });
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
