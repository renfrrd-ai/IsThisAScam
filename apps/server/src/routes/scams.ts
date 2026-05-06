import { Router } from "express";
import { ApiError } from "../lib/api-error";
import { asyncHandler } from "../lib/async-handler";
import { parseWithSchema } from "../lib/request-validation";
import type { ScamRepository } from "../modules/scams/scam.repository";
import { scamSearchSchema } from "../modules/scams/scam.search";

export function createScamsRouter(scamRepository: ScamRepository) {
  const router = Router();

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const scams = await scamRepository.listApprovedScams();
      res.json({ scams });
    }),
  );

  router.get(
    "/search",
    asyncHandler(async (req, res) => {
      const filters = parseWithSchema(scamSearchSchema, req.query);
      const scams = await scamRepository.searchApprovedScams(filters);
      res.json({ scams, filters });
    }),
  );

  router.get(
    "/:slug",
    asyncHandler(async (req, res) => {
      const slug = req.params.slug;

      if (!slug) {
        throw new ApiError(400, "Missing scam slug");
      }

      const scam = await scamRepository.findApprovedScamBySlug(slug);

      if (!scam) {
        throw new ApiError(404, "Scam not found");
      }

      res.json({ scam });
    }),
  );

  return router;
}
