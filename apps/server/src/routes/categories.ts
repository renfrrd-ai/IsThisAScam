import { Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import type { ScamRepository } from "../modules/scams/scam.repository";

export function createCategoriesRouter(scamRepository: ScamRepository) {
  const router = Router();

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const categories = await scamRepository.listCategories();
      res.json({ categories });
    }),
  );

  return router;
}

