import { datePeriodSchema, getTransactionsSchema } from "@/zod-schemas/index";
import { dashboardService } from "@/services/index";
import { HttpError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const dashboardController = {
  async getHomeData(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "User not authenticated");
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

  async getTransactionsSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new HttpError(401, "User not authenticated");
      }

      const { userId } = req.user;

      const rawMonth = Number(req.query.month);
      const rawYear = Number(req.query.year);

      const validationResult = datePeriodSchema.safeParse({
        month: rawMonth,
        year: rawYear,
      });
      if (!validationResult.success) {
        throw new HttpError(400, validationResult.error.issues[0].message);
      }

      const { month, year } = validationResult.data;

      const transactionsData = await dashboardService.getTransactionsSummary({
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

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "User not authenticated");
      }

      const { userId } = req.user;

      const rawStartDate = req.query.startDate;
      const rawEndDate = req.query.endDate;
      const rawPage = Number(req.query.page);
      const rawLimit = Number(req.query.limit);
      const rawOrderBy = req.query.orderBy;

      const validationResult = getTransactionsSchema.safeParse({
        startDate: rawStartDate,
        endDate: rawEndDate,
        page: rawPage,
        limit: rawLimit,
        orderBy: rawOrderBy,
      });
      if (!validationResult.success) {
        throw new HttpError(400, validationResult.error.issues[0].message);
      }

      const { startDate, endDate, page, limit, orderBy } =
        validationResult.data;

      const transactions = await dashboardService.getTransactions({
        userId,
        startDate,
        endDate,
        page,
        limit,
        orderBy,
      });

      if (!transactions) {
        throw new HttpError(404, "No transactions found");
      }

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  },

  async getAnalyticsData(req: Request, res: Response, next: NextFunction) {
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
