import {
  createExpenseSchema,
  deleteExpenseSchema,
  updateExpenseSchema,
} from "@/schemas";
import { expenseService } from "@/services/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const expenseController = {
  async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId } = req.user;

      const validationResult = createExpenseSchema.safeParse(req.body);
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const { category, description, amount, date } = validationResult.data;

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
      const id = Number(idParam);

      const validationResult = updateExpenseSchema.safeParse({
        id,
        ...req.body,
      });
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const { category, description, amount, date } = validationResult.data;

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
      const id = Number(idParam);

      const validationResult = deleteExpenseSchema.safeParse({ id });
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
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
