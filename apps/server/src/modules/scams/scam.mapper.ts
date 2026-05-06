import type { Category, Database, ScamDetail, ScamSummary } from "@scamradar/types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type ScamRow = Database["public"]["Tables"]["scams"]["Row"];

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapScamSummary(row: ScamRow, category: Category): ScamSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category,
    description: row.description,
    severity: row.severity,
    country: row.country ?? undefined,
    platform: row.platform ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapScamDetail(row: ScamRow, category: Category): ScamDetail {
  return {
    ...mapScamSummary(row, category),
    howItWorks: row.how_it_works,
    warningSigns: row.warning_signs,
    exampleMessages: row.example_messages,
    preventionSteps: row.prevention_steps,
    recoverySteps: row.recovery_steps,
    emotionalTriggers: row.emotional_triggers,
    relatedScamSlugs: row.related_scam_slugs,
    updatedAt: row.updated_at,
  };
}

