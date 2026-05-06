import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import type { RateLimitOptions } from "./middleware/rate-limit";
import { ReportRepository } from "./modules/reports/report.repository";
import { ScamRepository } from "./modules/scams/scam.repository";
import { createCategoriesRouter } from "./routes/categories";
import { healthRouter } from "./routes/health";
import { createReportsRouter } from "./routes/reports";
import { createScamsRouter } from "./routes/scams";
import { createSearchRouter } from "./routes/search";

export interface AppDependencies {
  scamRepository?: ScamRepository;
  reportRepository?: ReportRepository;
  reportRateLimit?: RateLimitOptions;
}

export function createApp(dependencies: AppDependencies = {}) {
  const app = express();
  const scamRepository = dependencies.scamRepository ?? new ScamRepository();
  const reportRepository =
    dependencies.reportRepository ?? new ReportRepository();
  const reportRateLimit = dependencies.reportRateLimit ?? {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    message: "Too many report submissions",
  };

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use("/health", healthRouter);
  app.use("/categories", createCategoriesRouter(scamRepository));
  app.use("/scams", createScamsRouter(scamRepository));
  app.use("/search", createSearchRouter(scamRepository));
  app.use("/reports", createReportsRouter(reportRepository, reportRateLimit));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
