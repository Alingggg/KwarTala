import { verifyToken } from "#utils";

function authMiddleware(req, res, next) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    const error = new Error("Access token is required");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const user = verifyToken(accessToken, "access-token");
    req.user = user;
    next();
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    return next(error);
  }
}

export default authMiddleware;
