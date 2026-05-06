import { beforeEach, describe, expect, it } from "vitest";
import type { Category, ScamDetail, ScamReport, ScamSummary } from "@scamradar/types";
import { createApp } from "../src/app";
import { resetRateLimitStore } from "../src/middleware/rate-limit";
import { invokeApp } from "./helpers/app-request";

const jobCategory: Category = {
  id: "cat-job",
  name: "Job",
  slug: "job",
};

const scamSummary: ScamSummary = {
  id: "scam-1",
  title: "Fake Remote Job Task Scam",
  slug: "fake-remote-job-task-scam",
  category: jobCategory,
  description: "A fake recruiter asks for deposits to unlock earnings.",
  severity: "high",
  platform: "WhatsApp",
  status: "approved",
  createdAt: "2026-05-06T00:00:00.000Z",
};

const scamDetail: ScamDetail = {
  ...scamSummary,
  howItWorks: "Recruiter messages lead to paid tasks and blocked withdrawals.",
  warningSigns: ["Unexpected recruiter contact"],
  exampleMessages: ["Complete prepaid tasks to unlock your commission."],
  preventionSteps: ["Do not pay to receive wages"],
  recoverySteps: ["Stop sending money"],
  emotionalTriggers: ["Urgency"],
  relatedScamSlugs: [],
  updatedAt: "2026-05-06T00:00:00.000Z",
};

const createdReport: ScamReport = {
  id: "report-1",
  title: "Suspicious scholarship text",
  description:
    "A sender promised a scholarship but asked for a fee before releasing funds.",
  platform: "SMS",
  status: "pending",
  createdAt: "2026-05-06T00:00:00.000Z",
};

describe("Phase 3 API routes", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("returns public categories", async () => {
    const app = createApp({
      scamRepository: {
        listCategories: async () => [jobCategory],
        listApprovedScams: async () => [],
        searchApprovedScams: async () => [],
        findApprovedScamBySlug: async () => null,
      },
      reportRepository: {
        createPendingReport: async () => createdReport,
      },
    });

    const response = await invokeApp(app, {
      method: "GET",
      url: "/categories",
    });

    expect(response.statusCode).toBe(200);
    expect(response._getJSONData()).toEqual({
      categories: [jobCategory],
    });
  });

  it("returns approved scams", async () => {
    const app = createApp({
      scamRepository: {
        listCategories: async () => [jobCategory],
        listApprovedScams: async () => [scamSummary],
        searchApprovedScams: async () => [],
        findApprovedScamBySlug: async () => null,
      },
      reportRepository: {
        createPendingReport: async () => createdReport,
      },
    });

    const response = await invokeApp(app, {
      method: "GET",
      url: "/scams",
    });

    expect(response.statusCode).toBe(200);
    expect(response._getJSONData()).toEqual({
      scams: [scamSummary],
    });
  });

  it("returns a scam detail by slug", async () => {
    const app = createApp({
      scamRepository: {
        listCategories: async () => [jobCategory],
        listApprovedScams: async () => [scamSummary],
        searchApprovedScams: async () => [],
        findApprovedScamBySlug: async (slug: string) =>
          slug === scamDetail.slug ? scamDetail : null,
      },
      reportRepository: {
        createPendingReport: async () => createdReport,
      },
    });

    const response = await invokeApp(app, {
      method: "GET",
      url: `/scams/${scamDetail.slug}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response._getJSONData()).toEqual({
      scam: scamDetail,
    });
  });

  it("returns 404 for an unknown scam slug", async () => {
    const app = createApp({
      scamRepository: {
        listCategories: async () => [],
        listApprovedScams: async () => [],
        searchApprovedScams: async () => [],
        findApprovedScamBySlug: async () => null,
      },
      reportRepository: {
        createPendingReport: async () => createdReport,
      },
    });

    const response = await invokeApp(app, {
      method: "GET",
      url: "/scams/missing-scam",
    });

    expect(response.statusCode).toBe(404);
    expect(response._getJSONData()).toEqual({
      error: "Scam not found",
    });
  });

  it("searches scams with filters", async () => {
    const app = createApp({
      scamRepository: {
        listCategories: async () => [],
        listApprovedScams: async () => [],
        searchApprovedScams: async () => [scamSummary],
        findApprovedScamBySlug: async () => null,
      },
      reportRepository: {
        createPendingReport: async () => createdReport,
      },
    });

    const response = await invokeApp(app, {
      method: "GET",
      url: "/search/scams",
      query: {
        q: "remote job",
        category: "job",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response._getJSONData()).toEqual({
      scams: [scamSummary],
      filters: {
        q: "remote job",
        category: "job",
      },
    });
  });

  it("creates a pending report", async () => {
    const app = createApp({
      scamRepository: {
        listCategories: async () => [],
        listApprovedScams: async () => [],
        searchApprovedScams: async () => [],
        findApprovedScamBySlug: async () => null,
      },
      reportRepository: {
        createPendingReport: async () => createdReport,
      },
      reportRateLimit: {
        maxRequests: 5,
        windowMs: 60_000,
      },
    });

    const response = await invokeApp(app, {
      method: "POST",
      url: "/reports",
      body: {
        title: "Suspicious scholarship text",
        description:
          "A sender promised a scholarship but asked for a fee before releasing funds.",
        platform: "SMS",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response._getJSONData()).toEqual({
      report: createdReport,
    });
  });

  it("rejects invalid report submissions", async () => {
    const app = createApp({
      scamRepository: {
        listCategories: async () => [],
        listApprovedScams: async () => [],
        searchApprovedScams: async () => [],
        findApprovedScamBySlug: async () => null,
      },
      reportRepository: {
        createPendingReport: async () => createdReport,
      },
    });

    const response = await invokeApp(app, {
      method: "POST",
      url: "/reports",
      body: {
        title: "Bad",
        description: "Too short",
        platform: "S",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response._getJSONData().error).toBe("Invalid request");
  });

  it("rate limits repeated report submissions", async () => {
    const app = createApp({
      scamRepository: {
        listCategories: async () => [],
        listApprovedScams: async () => [],
        searchApprovedScams: async () => [],
        findApprovedScamBySlug: async () => null,
      },
      reportRepository: {
        createPendingReport: async () => createdReport,
      },
      reportRateLimit: {
        maxRequests: 1,
        windowMs: 60_000,
        message: "Too many report submissions",
      },
    });

    await invokeApp(app, {
      method: "POST",
      url: "/reports",
      body: {
        title: "Suspicious scholarship text",
        description:
          "A sender promised a scholarship but asked for a fee before releasing funds.",
        platform: "SMS",
      },
      ip: "1.1.1.1",
    });

    const response = await invokeApp(app, {
      method: "POST",
      url: "/reports",
      body: {
        title: "Suspicious scholarship text",
        description:
          "A sender promised a scholarship but asked for a fee before releasing funds.",
        platform: "SMS",
      },
      ip: "1.1.1.1",
    });

    expect(response.statusCode).toBe(429);
    expect(response._getJSONData()).toEqual({
      error: "Too many report submissions",
    });
  });
});
