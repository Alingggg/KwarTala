import type { CustomError, UserPayload } from "@/types/index";
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
    expiresIn: type === "access-token" ? "15m" : "30d",
  };

  return jwt.sign(payload, secret, options as jwt.SignOptions);
}

function verifyToken(
  token: string,
  type: "access-token" | "refresh-token"
): UserPayload {
  const secret =
    type === "access-token"
      ? process.env.JWT_ACCESS_TOKEN_SECRET
      : process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!decoded) {
      const error: CustomError = new Error("Invalid or expired token");
      error.statusCode = 401;
      throw error;
    }

    return decoded as UserPayload;
  } catch (err) {
    const error: CustomError = new Error("Invalid or expired token");
    error.statusCode = 401;
    throw error;
  }
}

export { generateToken, verifyToken };
