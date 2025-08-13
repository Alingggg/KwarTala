import * as z from "zod";

const createExpenseSchema = z.object({
  category: z
    .string()
    .min(1, { error: "Category is required" })
    .max(25, { error: "Category must be at most 25 characters" }),
  description: z
    .string()
    .max(50, { error: "Description must be at most 50 characters" })
    .optional(),
  amount: z
    .number({ error: "Amount must be a positive number" })
    .min(0)
    .max(10000000),
  date: z
    .date({ error: "Date is required" })
    .max(new Date(), { error: "Date cannot be in the future" }),
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
