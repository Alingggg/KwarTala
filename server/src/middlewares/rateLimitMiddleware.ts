import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8,
  message: {
    message: "Too many login attempts, please try again later.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    message: "Too many registration attempts, please try again later.",
  },
});

const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    message: "Too many password reset attempts, please try again later.",
  },
});

const emailVerificationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    message: "Too many email verification attempts, please try again later.",
  },
});

export {
  loginLimiter,
  registerLimiter,
  passwordResetRateLimit,
  emailVerificationRateLimit,
};
