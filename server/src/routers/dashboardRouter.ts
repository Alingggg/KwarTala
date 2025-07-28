import express from "express";
import { dashboardController } from "@/controllers";
import { authMiddleware } from "@/middlewares";

const router = express.Router();

router.get("/home", authMiddleware, dashboardController.getHomeData);
router.get(
  "/charts/daily",
  authMiddleware,
  dashboardController.getDailyChartData
);
router.get(
  "/charts/weekly",
  authMiddleware,
  dashboardController.getWeeklyChartData
);
router.get(
  "/transactions",
  authMiddleware,
  dashboardController.getTransactionsData
);

export default router;
