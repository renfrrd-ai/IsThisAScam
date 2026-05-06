import { Router } from "express";
import type { ScamRepository } from "../modules/scams/scam.repository";

export function createStatsRouter(scamRepository: ScamRepository) {
  const router = Router();

  router.get("/countries", async (req, res, next) => {
    try {
      const stats = await scamRepository.getScamCountsByCountry();
      res.json({ countries: stats });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
