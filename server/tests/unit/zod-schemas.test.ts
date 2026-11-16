import { describe, expect, it } from "vitest";
import { addDays, format } from "date-fns";
import {
  budgetSchema,
  chatMessageSchema,
  createExpenseSchema,
  datePeriodSchema,
  deleteExpenseSchema,
  getTransactionsSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  userNameSchema,
  verificationEmailSchema,
} from "@/zod-schemas/index";

function firstError(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return result.error?.issues[0].message;
}

describe("registerSchema", () => {
  const valid = {
    userName: "tester1",
    email: "tester@example.com",
    password: "Passw0rd!",
  };

  it("accepts valid input", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("trims the username", () => {
    const result = registerSchema.parse({ ...valid, userName: "  tester1  " });
    expect(result.userName).toBe("tester1");
  });

  it.each([
    ["ab", "Username must be at least 3 characters"],
    ["a".repeat(21), "Username must be at most 20 characters"],
    ["bad name!", "Username can only contain letters and numbers"],
  ])("rejects username %j", (userName, message) => {
    expect(firstError(registerSchema.safeParse({ ...valid, userName }))).toBe(message);
  });

  it("rejects an invalid email", () => {
    expect(firstError(registerSchema.safeParse({ ...valid, email: "nope" }))).toBe(
      "Invalid email format"
    );
  });

  it.each([
    ["Pa1!", "Password must be at least 8 characters"],
    ["Aa1!" + "a".repeat(61), "Password must be at most 64 characters"],
    ["password1!", "Must include upper & lowercase letters, a number, and a symbol"],
    ["PASSWORD1!", "Must include upper & lowercase letters, a number, and a symbol"],
    ["Password!!", "Must include upper & lowercase letters, a number, and a symbol"],
    ["Password12", "Must include upper & lowercase letters, a number, and a symbol"],
  ])("rejects password %j", (password, message) => {
    expect(firstError(registerSchema.safeParse({ ...valid, password }))).toBe(message);
  });
});

describe("loginSchema", () => {
  it("requires a password", () => {
    expect(
      firstError(loginSchema.safeParse({ email: "a@b.com", password: "" }))
    ).toBe("Password is required");
  });

  it("does not enforce password complexity", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });
});

describe("verificationEmailSchema", () => {
  it("accepts known types", () => {
    for (const type of ["register", "change-email", "reset-password"]) {
      expect(
        verificationEmailSchema.safeParse({ email: "a@b.com", type }).success
      ).toBe(true);
    }
  });

  it("rejects unknown types", () => {
    expect(
      verificationEmailSchema.safeParse({ email: "a@b.com", type: "other" }).success
    ).toBe(false);
  });
});

describe("userNameSchema", () => {
  it("validates a bare string", () => {
    expect(userNameSchema.safeParse("tester").success).toBe(true);
    expect(userNameSchema.safeParse(undefined).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("requires a token and strong password", () => {
    expect(
      resetPasswordSchema.safeParse({ token: "t", newPassword: "Passw0rd!" }).success
    ).toBe(true);
    expect(
      firstError(resetPasswordSchema.safeParse({ token: "", newPassword: "Passw0rd!" }))
    ).toBe("Token is required");
  });
});

describe("datePeriodSchema", () => {
  const currentYear = new Date().getFullYear();

  it("accepts a valid period", () => {
    expect(datePeriodSchema.safeParse({ month: 1, year: currentYear }).success).toBe(true);
  });

  it.each([
    [{ month: 0, year: 2024 }],
    [{ month: 13, year: 2024 }],
    [{ month: 1, year: 1999 }],
    [{ month: 1, year: currentYear + 1 }],
    [{ month: NaN, year: 2024 }],
  ])("rejects %j", (period) => {
    expect(datePeriodSchema.safeParse(period).success).toBe(false);
  });
});

describe("budgetSchema", () => {
  it.each([
    [-1, "Budget must not be negative"],
    [100000001, "Budget must not exceed 100 million"],
    ["100", "Budget must be a number"],
  ])("rejects amount %j", (amount, message) => {
    expect(firstError(budgetSchema.safeParse({ month: 1, year: 2024, amount }))).toBe(
      message
    );
  });

  it("accepts zero", () => {
    expect(budgetSchema.safeParse({ month: 1, year: 2024, amount: 0 }).success).toBe(true);
  });
});

describe("createExpenseSchema", () => {
  const valid = {
    category: "Food",
    description: "Lunch",
    amount: 150,
    date: "2024-05-01",
  };

  it("normalizes the date to yyyy-MM-dd", () => {
    const result = createExpenseSchema.parse({
      ...valid,
      date: "2024-05-01T10:30:00",
    });
    expect(result.date).toBe("2024-05-01");
  });

  it("accepts Date objects", () => {
    const result = createExpenseSchema.parse({
      ...valid,
      date: new Date(2024, 4, 1),
    });
    expect(result.date).toBe("2024-05-01");
  });

  it("turns an empty description into null", () => {
    expect(createExpenseSchema.parse({ ...valid, description: "" }).description).toBeNull();
  });

  it("rejects an invalid date", () => {
    expect(firstError(createExpenseSchema.safeParse({ ...valid, date: "not-a-date" }))).toBe(
      "Invalid date"
    );
  });

  it("rejects a future date", () => {
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    expect(firstError(createExpenseSchema.safeParse({ ...valid, date: tomorrow }))).toBe(
      "Date cannot be in the future"
    );
  });

  it.each([
    [{ category: "" }, "Category is required"],
    [{ category: "x".repeat(26) }, "Category must be at most 25 characters"],
    [{ description: "x".repeat(51) }, "Description must be at most 50 characters"],
  ])("rejects %j", (override, message) => {
    expect(firstError(createExpenseSchema.safeParse({ ...valid, ...override }))).toBe(
      message
    );
  });

  it("rejects out-of-range amounts", () => {
    expect(createExpenseSchema.safeParse({ ...valid, amount: -1 }).success).toBe(false);
    expect(createExpenseSchema.safeParse({ ...valid, amount: 10000001 }).success).toBe(false);
  });
});

describe("deleteExpenseSchema", () => {
  it.each([0, NaN, -5])("rejects id %j", (id) => {
    expect(firstError(deleteExpenseSchema.safeParse({ id }))).toBe("Invalid expense ID");
  });
});

describe("getTransactionsSchema", () => {
  const valid = {
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    page: 1,
    limit: 10,
    orderBy: "desc",
  };

  it("accepts valid input", () => {
    expect(getTransactionsSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    [{ startDate: "01-01-2024" }, "startDate must be in YYYY-MM-DD format"],
    [{ endDate: "2024/01/31" }, "endDate must be in YYYY-MM-DD format"],
    [{ page: 0 }, "page must be a positive integer"],
    [{ limit: -1 }, "limit must be a positive integer"],
    [{ orderBy: "random" }, "orderBy must be either 'desc' or 'asc'"],
  ])("rejects %j", (override, message) => {
    expect(firstError(getTransactionsSchema.safeParse({ ...valid, ...override }))).toBe(
      message
    );
  });

  it("rejects non-integer page", () => {
    expect(getTransactionsSchema.safeParse({ ...valid, page: 1.5 }).success).toBe(false);
  });
});

describe("chatMessageSchema", () => {
  it("rejects blank and too-long messages", () => {
    expect(
      firstError(chatMessageSchema.safeParse({ message: "   ", currency: "PHP" }))
    ).toBe("Message is required");
    expect(
      firstError(chatMessageSchema.safeParse({ message: "x".repeat(501), currency: "PHP" }))
    ).toBe("Message must be at most 500 characters");
  });

  it("validates currency", () => {
    expect(
      firstError(chatMessageSchema.safeParse({ message: "hi", currency: "TOOLONG" }))
    ).toBe("Currency must be at most 5 characters");
  });
});
