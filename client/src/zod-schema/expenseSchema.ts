import { format, isAfter } from "date-fns";
import * as z from "zod";

const expenseSchema = z.object({
  category: z
    .string()
    .min(1, { error: "Category is required" })
    .max(25, { error: "Category must be at most 25 characters" }),
  description: z
    .string()
    .max(50, { error: "Description must be at most 50 characters" }),
  amount: z
    .number({ error: "Amount must be a positive number" })
    .min(0)
    .max(10000000),
  date: z
    .string()
    .transform((val) => new Date(val))
    .refine((dateObj) => !isNaN(dateObj.getTime()), { error: "Invalid date" })
    .refine((dateObj) => !isAfter(dateObj, new Date()), {
      error: "Date must not be in the future",
    })
    .transform((dateObj) => format(dateObj, "yyyy-MM-dd")),
});

export { expenseSchema };
