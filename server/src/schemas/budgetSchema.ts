import * as z from "zod";

const budgetSchema = z.object({
  month: z
    .number({ error: "Month must be a number" })
    .min(1, { error: "Month is required" })
    .max(12),
  year: z
    .number({ error: "Year must be a number" })
    .min(2000, { error: "Year is required " })
    .max(new Date().getFullYear()),
  amount: z
    .number({ error: "Budget must be a number" })
    .min(0, { error: "Budget must not be negative" })
    .max(100000000, { error: "Budget must not exceed 100 million" }),
});

export { budgetSchema };
