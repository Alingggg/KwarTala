import * as z from "zod";

const userNameSchema = z
  .string()
  .trim()
  .min(1, { error: "Username is required" })
  .min(3, { error: "Username must be at least 3 characters" })
  .max(20, { error: "Username must be at most 20 characters" })
  .regex(/^[a-zA-Z0-9]+$/, {
    error: "Username can only contain letters and numbers",
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

const registerSchema = loginSchema
  .extend({
    userName: userNameSchema,
    confirmPassword: z
      .string()
      .min(1, { error: "Confirm password is required" }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, { error: "Password must be at least 8 characters" })
      .max(64, { error: "Password must be at most 64 characters" })
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/, {
        error: "Must include upper & lowercase letters, a number, and a symbol",
      }),
    confirmPassword: z
      .string()
      .min(1, { error: "Confirm password is required" }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

const changeEmailSchema = z
  .object({
    newEmail: z
      .string()
      .min(1, { error: "Email is required" })
      .email({ error: "Invalid email format" }),
    confirmEmail: z
      .string()
      .min(1, { error: "Confirm email is required" })
      .email({ error: "Invalid email format" }),
  })
  .refine((schema) => schema.newEmail === schema.confirmEmail, {
    error: "Emails do not match",
    path: ["confirmEmail"],
  });

export {
  registerSchema,
  loginSchema,
  userNameSchema,
  resetPasswordSchema,
  changeEmailSchema,
};
