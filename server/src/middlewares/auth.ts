import { HttpError, type UserPayload } from "@/types/index";
import { verifyToken } from "@/utils/index";
import type { NextFunction, Request, Response } from "express";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw new HttpError(401, "Access token is required");
  }

  try {
    const user = verifyToken(accessToken, "access-token");

    if (!user) {
      throw new HttpError(401, "Invalid or expired token");
    }

    req.user = user as UserPayload;
    next();
  } catch (err) {
    throw new HttpError(401, "Invalid or expired token");
  }
}

export default authMiddleware;
