import { Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import { parseWithSchema } from "../lib/request-validation";
import type { ScamRepository } from "../modules/scams/scam.repository";
import { scamSearchSchema } from "../modules/scams/scam.search";

export function createSearchRouter(scamRepository: ScamRepository) {
  const router = Router();

  router.get(
    "/scams",
    asyncHandler(async (req, res) => {
      const filters = parseWithSchema(scamSearchSchema, req.query);
      const scams = await scamRepository.searchApprovedScams(filters);
      res.json({ scams, filters });
    }),
  );

  return router;
}

