import jwt from "jsonwebtoken";

function generateToken(user, type) {
  const payload = user;
  const secret =
    type === "access-token"
      ? process.env.JWT_ACCESS_TOKEN_SECRET
      : process.env.JWT_REFRESH_TOKEN_SECRET;
  const options = {
    expiresIn: type === "access-token" ? "15m" : "30d", // 15 minutes, 30 days
  };
  return jwt.sign(payload, secret, options);
}
``;

function verifyToken(token, type) {
  const secret =
    type === "access-token"
      ? process.env.JWT_ACCESS_TOKEN_SECRET
      : process.env.JWT_REFRESH_TOKEN_SECRET;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    throw error;
  }
}

export { generateToken, verifyToken };
