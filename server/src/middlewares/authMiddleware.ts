import type { CustomError, UserPayload } from "@/types/index";
import { verifyToken } from "@/utils/index";
import type { NextFunction, Request, Response } from "express";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    const error: CustomError = new Error("Access token is required");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const user = verifyToken(accessToken, "access-token");

    if (!user) {
      const error: CustomError = new Error("Invalid or expired token");
      error.statusCode = 401;
      return next(error);
    }

    req.user = user as UserPayload;
    next();
  } catch (err) {
    const error: CustomError = new Error("Invalid or expired token");
    error.statusCode = 401;
    return next(error);
  }
}

export default authMiddleware;
