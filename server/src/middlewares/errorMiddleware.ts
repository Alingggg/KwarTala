import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

function errorMiddleware(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error occurred:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
}

export default errorMiddleware;
