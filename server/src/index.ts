import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { setupRoutes } from "@/routers";
import { errorMiddleware } from "@/middlewares";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

setupRoutes(app);

app.use(errorMiddleware);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
