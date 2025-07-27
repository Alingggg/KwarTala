import type { CustomError, UserPayload } from "@/types";
import jwt from "jsonwebtoken";

function generateToken(
  user: UserPayload,
  type: "access-token" | "refresh-token"
) {
  const payload = user;
  const secret =
    type === "access-token"
      ? process.env.JWT_ACCESS_TOKEN_SECRET
      : process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  const options = {
    expiresIn: type === "access-token" ? "15m" : "30d", // 15 minutes, 30 days
  };

  return jwt.sign(payload, secret, options as jwt.SignOptions);
}

function verifyToken(token: string, type: "access-token" | "refresh-token") {
  const secret =
    type === "access-token"
      ? process.env.JWT_ACCESS_TOKEN_SECRET
      : process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    const error: CustomError = new Error("Invalid or expired token");
    error.statusCode = 401;
    throw error;
  }
}

export { generateToken, verifyToken };
