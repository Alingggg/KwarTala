import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { setupRoutes } from "@/routers/index";
import { errorMiddleware } from "@/middlewares/index";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

setupRoutes(app);

app.use(errorMiddleware);

export default app;
