import { HttpError, type UserPayload } from "@/types/index";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

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
    jwtid: randomUUID(),
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
      throw new HttpError(401, "Invalid or expired token");
    }

    return decoded as UserPayload;
  } catch (err) {
    throw new HttpError(401, "Invalid or expired token");
  }
}

export { generateToken, verifyToken };
