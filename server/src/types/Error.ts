interface CustomError extends Error {
  statusCode?: number;
}

export type { CustomError };
