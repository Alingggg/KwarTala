import express from "express";
import { dashboardController } from "@/controllers/index";
import { authMiddleware } from "@/middlewares/index";

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
  "/transactions/summary",
  authMiddleware,
  dashboardController.getTransactionsSummary
);

router.get(
  "/transactions",
  authMiddleware,
  dashboardController.getTransactions
);

router.get("/analytics", authMiddleware, dashboardController.getAnalyticsData);

export default router;
