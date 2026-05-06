import { Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import { parseWithSchema } from "../lib/request-validation";
import type { AiCheckLogInput } from "../modules/ai/ai-check.validation";
import { aiCheckLogSchema } from "../modules/ai/ai-check.validation";
import type { AiService } from "../modules/ai/ai.service";
import { createAiService } from "../modules/ai/ai.service";
import { getSupabaseClient } from "../db/supabase";
import { getServerEnv } from "../config/env";

export function createAiRouter(aiService?: AiService) {
  const router = Router();

  const service =
    aiService ??
    createAiService(
      getSupabaseClient(),
      getServerEnv().OPENAI_API_KEY ?? undefined,
    );

  router.post(
    "/check",
    asyncHandler(async (req, res) => {
      const input = parseWithSchema(aiCheckLogSchema, req.body);

      // Validate input
      if (!input.inputText || input.inputText.trim().length < 10) {
        res.status(400).json({
          error: "Input text must be at least 10 characters long",
        });
        return;
      }

      if (input.inputText.length > 12000) {
        res.status(400).json({
          error: "Input text exceeds maximum length of 12000 characters",
        });
        return;
      }

      // Perform analysis
      const result = await service.analyzeText(input.inputText);

      // Log the check (fire and forget)
      service
        .logAiCheck({
          inputText: input.inputText.substring(0, 1000), // Truncate for privacy
          riskLevel: result.riskLevel,
          aiResponse: {
            explanation: result.explanation,
            warningSigns: result.warningSigns,
            safetyRecommendations: result.safetyRecommendations,
            confidence: result.confidence,
          },
          matchedScams: result.similarScams,
        })
        .catch(() => {
          // Logging failure shouldn't affect the response
        });

      res.json({
        riskLevel: result.riskLevel,
        explanation: result.explanation,
        warningSigns: result.warningSigns,
        safetyRecommendations: result.safetyRecommendations,
        confidence: result.confidence,
        similarScams: result.similarScams,
        matchedPatterns: result.matchedPatterns,
        urgencyIndicators: result.urgencyIndicators,
        emotionalTriggers: result.emotionalTriggers,
      });
    }),
  );

  return router;
}
