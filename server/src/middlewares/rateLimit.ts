import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8,
  message: {
    message: "Too many login attempts, please try again later.",
  },
  skip: () => process.env.DISABLE_RATE_LIMIT === "true",
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

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  keyGenerator: (req) => String(req.user?.userId),
  message: {
    message: "Too many messages, please try again later.",
  },
});

export {
  loginLimiter,
  registerLimiter,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  chatLimiter,
};
