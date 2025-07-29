import type { Request } from "express";
import type { UserPayload } from "@/types";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
