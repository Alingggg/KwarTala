import { budgetService } from "@/services";
import type { CustomError } from "@/types";
import type { NextFunction, Request, Response } from "express";

const budgetController = {
  async updateBudget(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        return next(error);
      }

      const { userId } = req.user;
      const month = Number(req.query.month);
      const year = Number(req.query.year);
      const { amount } = req.body;

      if (!month || !year || !amount) {
        const error: CustomError = new Error("All fields are required");
        error.statusCode = 400;
        return next(error);
      }

      let budget = await budgetService.updateBudgetByUserIdAndDate({
        userId,
        month,
        year,
        amount,
      });

      if (!budget) {
        budget = await budgetService.createBudget({
          userId,
          month,
          year,
          amount,
        });
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
