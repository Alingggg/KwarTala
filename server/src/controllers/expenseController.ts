import { expenseService } from "@/services/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const expenseController = {
  async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        return next(error);
      }

      const { userId } = req.user;
      const { category, description, amount, date } = req.body;

      if (!category || !amount || !date) {
        const error: CustomError = new Error(
          "Category, amount, and date are required"
        );
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

  async updateExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: idParam } = req.params;
      const { category, description, amount, date } = req.body;

      const id = idParam ? Number(idParam) : undefined;
      if (!id || isNaN(id)) {
        const error: CustomError = new Error(
          "Expense ID is required and must be a number"
        );
        error.statusCode = 400;
        return next(error);
      }

      if (!category || !amount || !date) {
        const error: CustomError = new Error(
          "Category, amount, and date are required"
        );
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

  async deleteExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: idParam } = req.params;
      const id = idParam ? Number(idParam) : undefined;
      if (!id || isNaN(id)) {
        const error: CustomError = new Error(
          "Expense ID is required and must be a number"
        );
        error.statusCode = 400;
        return next(error);
      }

      await expenseService.deleteExpense(id);

      res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default expenseController;
