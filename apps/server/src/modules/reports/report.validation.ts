import { z } from "zod";
import { sanitizePlainText, isValidUrl } from "@scamradar/shared";

export const reportSubmissionSchema = z.object({
  title: z.string().trim().min(3).max(160),
  categoryId: z.string().uuid().optional(),
  description: z.string().trim().min(20).max(5000),
  messageText: z.string().trim().max(10000).optional(),
  platform: z.string().trim().min(2).max(80),
  country: z.string().trim().max(80).optional(),
  screenshotUrl: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
});

export type ReportSubmission = z.infer<typeof reportSubmissionSchema>;

// Validate and sanitize input
export function validateReportInput(input: unknown) {
  const parsed = reportSubmissionSchema.parse(input);
  return {
    ...parsed,
    title: sanitizePlainText(parsed.title),
    description: sanitizePlainText(parsed.description),
    platform: sanitizePlainText(parsed.platform),
    country: parsed.country ? sanitizePlainText(parsed.country) : undefined,
    messageText: parsed.messageText ? sanitizePlainText(parsed.messageText) : undefined,
  };
}

