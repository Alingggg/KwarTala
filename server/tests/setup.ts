import { afterEach, beforeEach, vi } from "vitest";

vi.mock("@/services/index", () => ({
  authService: {
    registerUser: vi.fn(),
    loginUser: vi.fn(),
    refreshAccessToken: vi.fn(),
    logoutUser: vi.fn(),
    getUserProfile: vi.fn(),
    sendVerificationEmail: vi.fn(),
    verifyEmail: vi.fn(),
    updateUserName: vi.fn(),
    updatePassword: vi.fn(),
    hasToReLogIn: vi.fn(),
    getUserByEmail: vi.fn(),
  },
  sessionService: {
    deleteSessionByToken: vi.fn(),
  },
  expenseService: {
    createExpense: vi.fn(),
    updateExpense: vi.fn(),
    deleteExpense: vi.fn(),
  },
  budgetService: {
    getBudgetByUserIdAndDate: vi.fn(),
    updateBudgetByUserIdAndDate: vi.fn(),
  },
  dashboardService: {
    getHomeData: vi.fn(),
    getDailyChartData: vi.fn(),
    getWeeklyChartData: vi.fn(),
    getTransactionsSummary: vi.fn(),
    getTransactions: vi.fn(),
    getAnalyticsData: vi.fn(),
  },
  verificationTokenService: {},
  emailService: {},
}));

vi.mock("@/ai/index", () => ({
  runChat: vi.fn(),
  getHistory: vi.fn(),
  saveHistory: vi.fn(),
  clearHistory: vi.fn(),
}));

vi.mock("@/middlewares/rateLimit", () => {
  const passThrough = (_req: unknown, _res: unknown, next: () => void) =>
    next();
  return {
    loginLimiter: passThrough,
    registerLimiter: passThrough,
    passwordResetRateLimit: passThrough,
    emailVerificationRateLimit: passThrough,
    chatLimiter: passThrough,
  };
});

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
