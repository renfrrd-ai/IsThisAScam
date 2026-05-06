import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SCAM_CATEGORY_SEEDS, isValidSlug } from "@scamradar/shared";
import { describe, expect, it } from "vitest";
import { aiCheckLogSchema } from "../../src/modules/ai/ai-check.validation";
import { reportSubmissionSchema } from "../../src/modules/reports/report.validation";

const migrationSql = readFileSync(
  resolve(__dirname, "../../../../supabase/migrations/20260506010000_initial_schema.sql"),
  "utf8",
);

describe("Supabase schema", () => {
  it("defines the required MVP tables", () => {
    expect(migrationSql).toContain("create table public.categories");
    expect(migrationSql).toContain("create table public.scams");
    expect(migrationSql).toContain("create table public.reports");
    expect(migrationSql).toContain("create table public.ai_checks");
  });

  it("defaults moderation records to pending or draft", () => {
    expect(migrationSql).toContain("status public.scam_status not null default 'draft'");
    expect(migrationSql).toContain("status public.report_status not null default 'pending'");
  });

  it("keeps seed category slugs unique and URL-safe", () => {
    const slugs = SCAM_CATEGORY_SEEDS.map((category) => category.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every(isValidSlug)).toBe(true);
  });
});

describe("database validation", () => {
  it("accepts a valid report submission", () => {
    const parsed = reportSubmissionSchema.parse({
      title: "Suspicious bank message",
      description: "A message claimed my account would be closed unless I verified through a link.",
      platform: "SMS",
    });

    expect(parsed.title).toBe("Suspicious bank message");
  });

  it("rejects short report descriptions", () => {
    expect(() =>
      reportSubmissionSchema.parse({
        title: "Bad link",
        description: "Too short",
        platform: "SMS",
      }),
    ).toThrow();
  });

  it("defaults AI check logs to unknown risk with empty structured output", () => {
    const parsed = aiCheckLogSchema.parse({
      inputText: "This is enough suspicious text to validate.",
    });

    expect(parsed.riskLevel).toBe("unknown");
    expect(parsed.aiResponse).toEqual({});
    expect(parsed.matchedScams).toEqual([]);
  });
});
