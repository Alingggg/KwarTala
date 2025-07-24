import { budgetRepository } from "#repositories";

const budgetService = {
  async createBudget({ date, amount }) {
    return budgetRepository.create({ date, amount });
  },
  async findBudgetByDate(date) {
    return budgetRepository.findByDate(date);
  },
  async updateBudgetByDate({ date, amount }) {
    return budgetRepository.updateByDate({ date, amount });
  },
};

export default budgetService;
