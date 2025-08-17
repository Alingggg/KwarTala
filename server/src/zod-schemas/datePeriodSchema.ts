import * as z from "zod";

const datePeriodSchema = z.object({
  month: z
    .number({ error: "Month must be a number" })
    .min(1, { error: "Month is required" })
    .max(12),
  year: z
    .number({ error: "Year must be a number" })
    .min(2000, { error: "Year is required " })
    .max(new Date().getFullYear()),
});

export { datePeriodSchema };
