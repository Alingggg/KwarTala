import * as z from "zod";

const getTransactionsSchema = z.object({
  startDate: z
    .string()
    .min(1, { error: "startDate is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      error: "startDate must be in YYYY-MM-DD format",
    }),
  endDate: z
    .string()
    .min(1, { error: "endDate is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      error: "endDate must be in YYYY-MM-DD format",
    }),
  page: z.int().positive({ error: "page must be a positive integer" }),
  limit: z.int().positive({ error: "limit must be a positive integer" }),
  orderBy: z.enum(["desc", "asc"], {
    error: "orderBy must be either 'desc' or 'asc'",
  }),
});

export { getTransactionsSchema };
