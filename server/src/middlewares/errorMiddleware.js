function errorMiddleware(err, req, res, next) {
  console.error("Error occurred:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

export default errorMiddleware;
