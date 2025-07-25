import { expenseService } from "#services";

const expenseController = {
  async createExpense(req, res, next) {
    try {
      const { userId } = req.user;
      const { category, description, amount, date } = req.body;

      if (!category || !amount || !date) {
        const error = new Error("Category, amount, and date are required");
        error.statusCode = 400;
        return next(error);
      }

      const newExpense = await expenseService.createExpense({
        userId,
        category,
        description,
        amount,
        date,
      });

      res
        .status(201)
        .json({ data: newExpense, message: "Expense created successfully" });
    } catch (error) {
      next(error);
    }
  },

  async updateExpense(req, res, next) {
    try {
      const { id } = req.params;
      const { category, description, amount, date } = req.body;

      if (!category || !amount || !date) {
        const error = new Error("Category, amount, and date are required");
        error.statusCode = 400;
        return next(error);
      }

      const updatedExpense = await expenseService.updateExpense({
        id,
        category,
        description,
        amount,
        date,
      });

      res.status(200).json({
        data: updatedExpense,
        message: "Expense updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteExpense(req, res, next) {
    try {
      const { id } = req.params;

      await expenseService.deleteExpense(id);

      res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default expenseController;
