import {
  analyticsDataService,
  chartDataService,
  homeDataService,
  transactionsDataService,
} from "@/services";
import type { CustomError } from "@/types";
import type { NextFunction, Request, Response } from "express";

const dashboardController = {
  async getHomeData(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        return next(error);
      }

      const { userId } = req.user;
      const homeData = await homeDataService.getHomeData(userId);

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
        return next(error);
      }

      const { userId } = req.user;

      const month = Number(req.query.month);
      const year = Number(req.query.year);

      if (!month || !year) {
        const error: CustomError = new Error("Month and year are required");
        error.statusCode = 400;
        return next(error);
      }

      const dailyExpenses = await chartDataService.getDailyChartData({
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
        return next(error);
      }

      const { userId } = req.user;

      const month = Number(req.query.month);
      const year = Number(req.query.year);

      if (!month || !year) {
        const error: CustomError = new Error("Month and year are required");
        error.statusCode = 400;
        return next(error);
      }

      const weeklyExpenses = await chartDataService.getWeeklyChartData({
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
        return next(error);
      }

      const { userId } = req.user;

      const month = Number(req.query.month);
      const year = Number(req.query.year);

      if (!month || !year) {
        const error: CustomError = new Error("Month and year are required");
        error.statusCode = 400;
        return next(error);
      }

      const transactionsData =
        await transactionsDataService.getMonthlyTransactions({
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
        return next(error);
      }

      const { userId } = req.user;

      const month = Number(req.query.month);
      const year = Number(req.query.year);

      if (!month || !year) {
        const error: CustomError = new Error("Month and year are required");
        error.statusCode = 400;
        return next(error);
      }

      const analyticsData = await analyticsDataService.getAnalyticsData({
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
