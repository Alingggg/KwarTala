import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter, budgetRouter, expenseRouter } from "#routers";
import { errorMiddleware } from "#middlewares";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/budgets", budgetRouter);

app.use(errorMiddleware);

export default app;
