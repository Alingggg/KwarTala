import { budgetService } from "@/services/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

function validateBudget({
  month,
  year,
  amount,
}: {
  month?: number;
  year?: number;
  amount?: number;
}) {
  if (!month || !year) {
    const error: CustomError = new Error("Budget Period is required");
    error.statusCode = 400;
    throw error;
  }
  if (amount === undefined || amount === null) {
    const error: CustomError = new Error("Budget is required");
    error.statusCode = 400;
    throw error;
  }
  if (typeof amount !== "number" || isNaN(amount)) {
    const error: CustomError = new Error("Budget must be a number");
    error.statusCode = 400;
    throw error;
  }
  if (amount < 0) {
    const error: CustomError = new Error("Budget cannot be negative");
    error.statusCode = 400;
    throw error;
  }
  if (amount > 100000000) {
    const error: CustomError = new Error("Budget must not exceed 100,000,000");
    error.statusCode = 400;
    throw error;
  }
}

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

      validateBudget({ month, year, amount });

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
