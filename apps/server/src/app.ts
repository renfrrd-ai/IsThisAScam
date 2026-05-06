import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import type { RateLimitOptions } from "./middleware/rate-limit";
import { ReportRepository } from "./modules/reports/report.repository";
import { ScamRepository } from "./modules/scams/scam.repository";
import { AiService } from "./modules/ai/ai.service";
import { createAiRouter } from "./routes/ai";
import { createAdminReportsRouter } from "./routes/admin-reports";
import { createAdminScamsRouter } from "./routes/admin-scams";
import { createCategoriesRouter } from "./routes/categories";
import { healthRouter } from "./routes/health";
import { createReportsRouter } from "./routes/reports";
import { createScamsRouter } from "./routes/scams";
import { createStatsRouter } from "./routes/stats";

export interface AppDependencies {
  scamRepository?: ScamRepository;
  reportRepository?: ReportRepository;
  aiService?: AiService;
  reportRateLimit?: RateLimitOptions;
}

export function createApp(dependencies: AppDependencies = {}) {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", "'unsafe-inline'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "https:"],
            },
          }
        : false,
    }),
  );

  // CORS - restrict in production
  const corsOptions = isProduction
    ? {
        origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
        credentials: true,
      }
    : {};

  app.use(cors(corsOptions));
  app.use(express.json({ limit: "1mb" }));

  // Logging - less verbose in production
  app.use(isProduction ? morgan("combined") : morgan("dev"));

  const scamRepository = dependencies.scamRepository ?? new ScamRepository();
  const reportRepository =
    dependencies.reportRepository ?? new ReportRepository();
  const aiService = dependencies.aiService;
  const reportRateLimit = dependencies.reportRateLimit ?? {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    message: "Too many report submissions",
  };

  app.use("/health", healthRouter);
  app.use("/categories", createCategoriesRouter(scamRepository));
  app.use("/scams", createScamsRouter(scamRepository));
  app.use("/stats", createStatsRouter(scamRepository));
  app.use("/reports", createReportsRouter(reportRepository, reportRateLimit));
  app.use("/ai", createAiRouter(aiService));
  app.use("/admin/reports", createAdminReportsRouter(reportRepository, scamRepository));
  app.use("/admin/scams", createAdminScamsRouter(scamRepository));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
