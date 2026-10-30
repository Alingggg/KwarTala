import { HttpError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error occurred:", err);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal server error" });
}

export default errorMiddleware;
