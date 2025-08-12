import { datePeriodSchema } from "@/schemas/index";
import { dashboardService } from "@/services/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const dashboardController = {
  async getHomeData(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId } = req.user;
      const homeData = await dashboardService.getHomeData(userId);

      res
        .status(200)
        .json({ data: homeData, message: "Home data retrieved successfully" });
    } catch (error) {
      next(error);
    }
  },

  async getDailyChartData(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId } = req.user;

      const month = Number(req.query.month);
      const year = Number(req.query.year);

      const validationResult = datePeriodSchema.safeParse({
        month,
        year,
      });
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const dailyExpenses = await dashboardService.getDailyChartData({
        userId,
        month,
        year,
      });

      res.status(200).json({
        data: dailyExpenses,
        message: "Daily expenses retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getWeeklyChartData(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId } = req.user;

      const month = Number(req.query.month);
      const year = Number(req.query.year);

      const validationResult = datePeriodSchema.safeParse({
        month,
        year,
      });
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const weeklyExpenses = await dashboardService.getWeeklyChartData({
        userId,
        month,
        year,
      });

      res.status(200).json({
        data: weeklyExpenses,
        message: "Weekly expenses retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getTransactionsData(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId } = req.user;

      const month = Number(req.query.month);
      const year = Number(req.query.year);

      const validationResult = datePeriodSchema.safeParse({
        month,
        year,
      });
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const transactionsData = await dashboardService.getMonthlyTransactions({
        userId,
        month,
        year,
      });

      res.status(200).json({
        data: transactionsData,
        message: "Monthly transactions data retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getAnalyticsData(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId } = req.user;

      const month = Number(req.query.month);
      const year = Number(req.query.year);

      const validationResult = datePeriodSchema.safeParse({
        month,
        year,
      });
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const analyticsData = await dashboardService.getAnalyticsData({
        userId,
        month,
        year,
      });

      res.status(200).json({
        data: analyticsData,
        message: "Analytics data retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default dashboardController;
