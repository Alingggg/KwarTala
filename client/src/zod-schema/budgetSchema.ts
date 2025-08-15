import * as z from "zod";
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

export { editBudgetSchema };
