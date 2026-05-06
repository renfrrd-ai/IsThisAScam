import { Router, type Request, type Response } from "express";
import { asyncHandler } from "../lib/async-handler";
import type { ScamRepository } from "../modules/scams/scam.repository";
import { requireAdminAuth } from "../middleware/admin-auth";
import type { ScamStatus } from "@scamradar/types";

export interface ScamCreationInput {
  title: string;
  slug: string;
  categoryId: string;
  description: string;
  howItWorks?: string;
  warningSigns?: string[];
  exampleMessages?: string[];
  preventionSteps?: string[];
  recoverySteps?: string[];
  emotionalTriggers?: string[];
  severity?: "low" | "medium" | "high" | "unknown";
  country?: string;
  platform?: string;
  status?: ScamStatus;
}

export function createAdminScamsRouter(scamRepository: ScamRepository) {
  const router = Router();

  // GET /admin/scams - List all scams (including drafts)
  router.get(
    "/",
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const status = req.query.status as ScamStatus | undefined;
      const scams = await scamRepository.listAllScams(status);
      res.json({ scams });
    }),
  );

  // POST /admin/scams - Create new scam entry
  router.post(
    "/",
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const input = req.body as ScamCreationInput;

      if (!input.title || !input.slug || !input.categoryId || !input.description) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const scam = await scamRepository.createScam({
        title: input.title,
        slug: input.slug,
        categoryId: input.categoryId,
        description: input.description,
        howItWorks: input.howItWorks ?? "",
        warningSigns: input.warningSigns ?? [],
        exampleMessages: input.exampleMessages ?? [],
        preventionSteps: input.preventionSteps ?? [],
        recoverySteps: input.recoverySteps ?? [],
        emotionalTriggers: input.emotionalTriggers ?? [],
        severity: input.severity ?? "unknown",
        country: input.country,
        platform: input.platform,
        status: input.status ?? "draft",
      });

      res.status(201).json({ scam });
    }),
  );

  // PATCH /admin/scams/:id - Update scam entry
  router.patch(
    "/:id",
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ error: "Missing scam ID" });
        return;
      }
      const updates = req.body;
      const scam = await scamRepository.updateScam(id, updates);

      if (!scam) {
        res.status(404).json({ error: "Scam not found" });
        return;
      }

      res.json({ scam });
    }),
  );

  // PATCH /admin/scams/:id/publish - Publish scam (set status to approved)
  router.patch(
    "/:id/publish",
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ error: "Missing scam ID" });
        return;
      }
      const scam = await scamRepository.updateScamStatus(
        id,
        "approved",
      );

      if (!scam) {
        res.status(404).json({ error: "Scam not found" });
        return;
      }

      // Generate embedding for the published scam
      try {
        await scamRepository.generateEmbeddingForScam(id);
      } catch {
        // Embedding generation is optional
      }

      res.json({ scam });
    }),
  );

  return router;
}
