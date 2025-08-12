import { budgetSchema } from "@/schemas/index";
import { budgetService } from "@/services/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const budgetController = {
  async getBudget(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId } = req.user;
      const month = Number(req.query.month);
      const year = Number(req.query.year);

      if (!month || !year) {
        const error: CustomError = new Error("Month and year are required");
        error.statusCode = 400;
        throw error;
      }

      const budget = await budgetService.findBudgetByUserIdAndDate({
        userId,
        month,
        year,
      });

      res
        .status(200)
        .json({ data: budget, message: "Budget retrieved successfully" });
    } catch (error) {
      next(error);
    }
  },

  async updateBudget(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId } = req.user;
      const month = Number(req.query.month);
      const year = Number(req.query.year);
      const { amount } = req.body;

      const validationResult = budgetSchema.safeParse({
        month,
        year,
        amount,
      });

      if (!validationResult.success) {
        const error: CustomError = new Error("Invalid budget data");
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const budget = await budgetService.updateBudgetByUserIdAndDate({
        userId,
        month,
        year,
        amount,
      });

      res
        .status(200)
        .json({ data: budget, message: "Budget updated successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default budgetController;
