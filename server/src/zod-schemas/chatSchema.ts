import * as z from "zod";

const chatMessageSchema = z.object({
  message: z
    .string({ error: "Message is required" })
    .trim()
    .min(1, { error: "Message is required" })
    .max(500, { error: "Message must be at most 500 characters" }),
  currency: z
    .string({ error: "Currency is required" })
    .min(1, { error: "Currency is required" })
    .max(5, { error: "Currency must be at most 5 characters" }),
});

export { chatMessageSchema };
