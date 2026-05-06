import type { Database, ScamReport } from "@scamradar/types";

type ReportRow = Database["public"]["Tables"]["reports"]["Row"];

export function mapReport(row: ReportRow): ScamReport {
  return {
    id: row.id,
    title: row.title,
    categoryId: row.category_id ?? undefined,
    description: row.description,
    messageText: row.message_text ?? undefined,
    platform: row.platform,
    country: row.country ?? undefined,
    screenshotUrl: row.screenshot_url ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

