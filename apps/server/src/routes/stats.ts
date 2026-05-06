import { Router } from "express";
import type { ScamRepository } from "../modules/scams/scam.repository";

export function createStatsRouter(scamRepository?: ScamRepository) {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      if (!scamRepository) return res.json({ message: "Stats not available" });
      const stats = await scamRepository.getScamCountsByCountry();
      res.json({ countries: stats });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
