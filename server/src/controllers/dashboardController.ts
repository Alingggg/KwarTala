import { homeDataService } from "@/services";
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
};

export default dashboardController;
