import { z } from "zod";

export const aiCheckLogSchema = z.object({
  inputText: z.string().trim().min(10).max(12000),
  riskLevel: z.enum(["low", "medium", "high", "unknown"]).default("unknown"),
  aiResponse: z.record(z.string(), z.unknown()).default({}),
  matchedScams: z.array(z.unknown()).default([]),
});

export type AiCheckLogInput = z.infer<typeof aiCheckLogSchema>;
