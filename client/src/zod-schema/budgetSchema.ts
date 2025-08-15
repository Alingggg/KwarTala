import { z } from "zod";
import { isAfter, parse } from "date-fns";

const editBudgetSchema = z.object({
  budgetPeriod: z
    .string()
    .refine((val) => /^\d{4}-\d{2}$/.test(val), {
      error: "Date period must be in YYYY-MM format",
    })
    .refine(
      (val) => {
        const parsed = parse(val, "yyyy-MM", new Date());
        return !isAfter(parsed, new Date());
      },
      { error: "Date must not be in the future" }
    ),
  budget: z
    .number({ error: "Budget is required" })
    .min(0, { error: "Budget cannot be negative" })
    .max(100000000),
});

const expenseSchema = z.object({
  date: z
    .string()
    .refine((val) => /^\d{4}-\d{2}$/.test(val), {
      message: "Date must be in YYYY-MM format",
    })
    .refine(
      (val) => {
        const [year, month] = val.split("-").map(Number);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        return (
          year < currentYear || (year === currentYear && month <= currentMonth)
        );
      },
      { message: "Date must not be in the future" }
    ),
});

export { editBudgetSchema, expenseSchema };
