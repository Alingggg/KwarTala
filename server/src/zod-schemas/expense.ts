import { format, isAfter } from "date-fns";
import * as z from "zod";

const createExpenseSchema = z.object({
  category: z
    .string()
    .min(1, { error: "Category is required" })
    .max(25, { error: "Category must be at most 25 characters" }),
  description: z
    .string()
    .max(50, { error: "Description must be at most 50 characters" })
    .transform((value) => (value === "" ? null : value)),
  amount: z
    .number({ error: "Amount must be a positive number" })
    .min(0)
    .max(10000000),
  date: z
    .union([z.string(), z.date()])
    .transform((val, ctx) => {
      const date = typeof val === "string" ? new Date(val) : val;

      if (isNaN(date.getTime())) {
        ctx.addIssue({ code: "custom", message: "Invalid date" });
        return z.NEVER;
      }

      return format(date, "yyyy-MM-dd");
    })
    .refine(
      (date) => {
        return !isAfter(new Date(date), new Date());
      },
      { error: "Date cannot be in the future" }
    ),
});

const updateExpenseSchema = createExpenseSchema.extend({
  id: z
    .number({ error: "Invalid expense ID" })
    .min(1, { error: "Invalid expense ID" }),
});

const deleteExpenseSchema = z.object({
  id: z
    .number({ error: "Invalid expense ID" })
    .min(1, { error: "Invalid expense ID" }),
});

export { createExpenseSchema, updateExpenseSchema, deleteExpenseSchema };
