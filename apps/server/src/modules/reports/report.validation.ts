import { z } from "zod";

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

