import type { Express } from "express";
import {
  authRouter,
  expenseRouter,
  budgetRouter,
  dashboardRouter,
  chatRouter,
} from "@/routers/index";

function setupRoutes(app: Express) {
  app.use("/api/auth", authRouter);
  app.use("/api/expenses", expenseRouter);
  app.use("/api/budgets", budgetRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/chat", chatRouter);
}

export default setupRoutes;
