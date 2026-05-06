import { sanitizePlainText } from "@scamradar/shared";
import { z } from "zod";

const optionalSearchText = z
  .string()
  .trim()
  .max(120)
  .transform((value) => sanitizePlainText(value))
  .optional();

export const scamSearchSchema = z.object({
  q: optionalSearchText,
  category: z.string().trim().max(80).optional(),
  platform: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
  phrase: optionalSearchText,
});

export type ScamSearchInput = z.infer<typeof scamSearchSchema>;

