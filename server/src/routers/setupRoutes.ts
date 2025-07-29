import type { Express } from "express";
import {
  authRouter,
  expenseRouter,
  budgetRouter,
  dashboardRouter,
} from "@/routers";

function setupRoutes(app: Express) {
  app.use("/api/auth", authRouter);
  app.use("/api/expenses", expenseRouter);
  app.use("/api/budgets", budgetRouter);
  app.use("/api/dashboard", dashboardRouter);
}

export default setupRoutes;
