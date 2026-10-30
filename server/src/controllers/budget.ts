import { budgetSchema, datePeriodSchema } from "@/zod-schemas/index";
import { budgetService } from "@/services/index";
import { HttpError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const budgetController = {
  async getBudget(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "User not authenticated");
      }

      const { userId } = req.user;
      const month = Number(req.query.month);
      const year = Number(req.query.year);

      const validationResult = datePeriodSchema.safeParse({
        month,
        year,
      });
      if (!validationResult.success) {
        throw new HttpError(400, validationResult.error.issues[0].message);
      }

      const budget = await budgetService.getBudgetByUserIdAndDate({
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
        throw new HttpError(401, "User not authenticated");
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
        throw new HttpError(400, validationResult.error.issues[0].message);
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
