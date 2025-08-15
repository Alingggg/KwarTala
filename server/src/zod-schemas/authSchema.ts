import * as z from "zod";

const registerSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(1, { error: "Username is required" })
    .min(3, { error: "Username must be at least 3 characters" })
    .max(20, { error: "Username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9]+$/, {
      error: "Username can only contain letters and numbers",
    }),
  email: z
    .string()
    .min(1, { error: "Email is required" })
    .email({ error: "Invalid email format" }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, { error: "Password must be at least 8 characters" })
    .max(64, { error: "Password must be at most 64 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/, {
      error: "Must include upper & lowercase letters, a number, and a symbol",
    }),
});

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Email is required" })
    .email({ error: "Invalid email format" }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, { error: "Password must be at least 8 characters" })
    .max(64, { error: "Password must be at most 64 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/, {
      error: "Must include upper & lowercase letters, a number, and a symbol",
    }),
});

const verificationEmailSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Email is required" })
    .email({ error: "Invalid email format" }),
  type: z.enum(["register", "change-email", "reset-password"]),
  newEmail: z
    .string()
    .min(1, { error: "New email is required" })
    .email({ error: "Invalid email format" })
    .optional(),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, { error: "Token is required" }),
  newEmail: z.string().email({ error: "Invalid email format" }).optional(),
});

const userNameSchema = z
  .string()
  .trim()
  .min(1, { error: "Username is required" })
  .min(3, { error: "Username must be at least 3 characters" })
  .max(20, { error: "Username must be at most 20 characters" })
  .regex(/^[a-zA-Z0-9]+$/, {
    error: "Username can only contain letters and numbers",
  });

const resetPasswordSchema = z.object({
  token: z.string().min(1, { error: "Token is required" }),
  newPassword: z
    .string()
    .min(1, "Password is required")
    .min(8, { error: "Password must be at least 8 characters" })
    .max(64, { error: "Password must be at most 64 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/, {
      error: "Must include upper & lowercase letters, a number, and a symbol",
    }),
});

export {
  registerSchema,
  loginSchema,
  verificationEmailSchema,
  verifyEmailSchema,
  userNameSchema,
  resetPasswordSchema,
};
