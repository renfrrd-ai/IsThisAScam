import { Router, type Request, type Response } from "express";
import { asyncHandler } from "../lib/async-handler";
import type { ReportRepository } from "../modules/reports/report.repository";
import type { ScamRepository } from "../modules/scams/scam.repository";
import { requireAdminAuth } from "../middleware/admin-auth";

export function createAdminReportsRouter(
  reportRepository: ReportRepository,
  scamRepository: ScamRepository,
) {
  const router = Router();

  // GET /admin/reports - List all reports (with optional status filter)
  router.get(
    "/",
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const status = req.query.status ? String(req.query.status) : undefined;
      const reports = await reportRepository.listReports(status as any);
      res.json({ reports });
    }),
  );

  // GET /admin/reports/:id - Get single report
  router.get(
    "/:id",
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ error: "Missing report ID" });
        return;
      }
      const report = await reportRepository.findReportById(id);
      if (!report) {
        res.status(404).json({ error: "Report not found" });
        return;
      }
      res.json({ report });
    }),
  );

  // PATCH /admin/reports/:id - Update report status
  router.patch(
    "/:id",
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ error: "Missing report ID" });
        return;
      }

      const body = req.body as Record<string, any>;
      const status = body.status;
      const convertToScam = body.convertToScam;

      const report = await reportRepository.findReportById(id);
      if (!report) {
        res.status(404).json({ error: "Report not found" });
        return;
      }

      if (status) {
        await reportRepository.updateReportStatus(id, String(status));
      }

      // If converting to scam entry
      if (convertToScam) {
        const scam = await scamRepository.createFromReport(report.id, {
          title: convertToScam.title || report.title,
          description: convertToScam.description || report.description,
          categoryId: convertToScam.categoryId || report.categoryId || "",
          platform: convertToScam.platform || report.platform,
          country: convertToScam.country || report.country,
          warningSigns: convertToScam.warningSigns || [],
          preventionSteps: convertToScam.preventionSteps || [],
        });

        // Update report status to approved
        await reportRepository.updateReportStatus(id, "approved");

        res.json({ report, scam });
        return;
      }

      const updated = await reportRepository.findReportById(id);
      res.json({ report: updated });
    }),
  );

  return router;
}
