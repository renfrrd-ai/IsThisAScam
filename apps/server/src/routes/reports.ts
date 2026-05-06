import { Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import { parseWithSchema } from "../lib/request-validation";
import { rateLimit, type RateLimitOptions } from "../middleware/rate-limit";
import type { ReportRepository } from "../modules/reports/report.repository";
import { reportSubmissionSchema } from "../modules/reports/report.validation";

export function createReportsRouter(
  reportRepository: ReportRepository,
  reportRateLimit: RateLimitOptions,
) {
  const router = Router();

  router.post(
    "/",
    rateLimit(reportRateLimit),
    asyncHandler(async (req, res) => {
      const input = parseWithSchema(reportSubmissionSchema, req.body);
      const report = await reportRepository.createPendingReport(input);
      res.status(201).json({ report });
    }),
  );

  return router;
}

