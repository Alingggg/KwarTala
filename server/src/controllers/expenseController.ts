import { expenseService } from "@/services/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

function validateExpense({
  category,
  description,
  amount,
  date,
}: {
  category?: string;
  description?: string;
  amount?: number;
  date?: string;
}) {
  if (!category) {
    const error: CustomError = new Error("Category is required");
    error.statusCode = 400;
    throw error;
  }
  if (category.length > 25) {
    const error: CustomError = new Error(
      "Category must be at most 25 characters"
    );
    error.statusCode = 400;
    throw error;
  }
  if (description && description.length > 50) {
    const error: CustomError = new Error(
      "Description must be at most 50 characters"
    );
    error.statusCode = 400;
    throw error;
  }
  if (amount === undefined || amount === null) {
    const error: CustomError = new Error("Amount is required");
    error.statusCode = 400;
    throw error;
  }
  if (typeof amount !== "number" || isNaN(amount)) {
    const error: CustomError = new Error("Amount must be a number");
    error.statusCode = 400;
    throw error;
  }
  if (amount < 0) {
    const error: CustomError = new Error("Amount cannot be negative");
    error.statusCode = 400;
    throw error;
  }
  if (amount > 10000000) {
    const error: CustomError = new Error("Amount must not exceed 10,000,000");
    error.statusCode = 400;
    throw error;
  }
  if (!date) {
    const error: CustomError = new Error("Date is required");
    error.statusCode = 400;
    throw error;
  }
}

const expenseController = {
  async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId } = req.user;
      const { category, description, amount, date } = req.body;

      validateExpense({ category, description, amount, date });

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
        throw error;
      }

      validateExpense({ category, description, amount, date });

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
        throw error;
      }

      await expenseService.deleteExpense(id);

      res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default expenseController;
