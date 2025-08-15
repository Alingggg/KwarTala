import { datePeriodSchema } from "./datePeriodSchema";
import * as z from "zod";

const budgetSchema = datePeriodSchema.extend({
  amount: z
    .number({ error: "Budget must be a number" })
    .min(0, { error: "Budget must not be negative" })
    .max(100000000, { error: "Budget must not exceed 100 million" }),
});

export { budgetSchema };
