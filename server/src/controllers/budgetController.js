import { budgetService } from "#services";

const budgetController = {
  async updateBudget(req, res, next) {
    try {
      const { userId } = req.user;
      const month = Number(req.query.month);
      const year = Number(req.query.year);
      const { amount } = req.body;

      if (!month || !year || !amount) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        return next(error);
      }

      const budget = await budgetService.updateBudgetByUserIdAndDate({
        userId,
        month,
        year,
        amount,
      });

      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }

      res
        .status(200)
        .json({ data: budget, message: "Budget updated successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default budgetController;
