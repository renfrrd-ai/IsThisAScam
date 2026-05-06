import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizePlainText } from "@scamradar/shared";
import type { Database, ScamReport, ReportStatus } from "@scamradar/types";
import { getSupabaseClient } from "../../db/supabase";
import { validateReportInput } from "./report.validation";
import type { ReportSubmission } from "./report.validation";
import { mapReport } from "./report.mapper";

// Use any to bypass strict Supabase typing
type AnySupabase = any;

export class ReportRepository {
  constructor(
    private readonly supabase: AnySupabase = getSupabaseClient(),
  ) {}

  async createPendingReport(input: ReportSubmission): Promise<ScamReport> {
    // Validate and sanitize input
    const validated = validateReportInput(input);

    const payload = {
      title: sanitizePlainText(validated.title),
      category_id: validated.categoryId,
      description: sanitizePlainText(validated.description),
      message_text: validated.messageText ? sanitizePlainText(validated.messageText) : null,
      platform: sanitizePlainText(validated.platform),
      country: validated.country ? sanitizePlainText(validated.country) : null,
      screenshot_url: validated.screenshotUrl ?? null,
      contact_email: validated.contactEmail ?? null,
      status: "pending",
    };

    const { data, error } = await this.supabase
      .from("reports")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return mapReport(data);
  }

  async listReports(status?: ReportStatus): Promise<ScamReport[]> {
    let query = this.supabase
      .from("reports")
      .select("*, categories(*)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row: any) => mapReport(row));
  }

  async findReportById(id: string): Promise<ScamReport | null> {
    const { data, error } = await this.supabase
      .from("reports")
      .select("*, categories(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return mapReport(data);
  }

  async updateReportStatus(
    id: string,
    status: string,
  ): Promise<ScamReport | null> {
    const { data, error } = await this.supabase
      .from("reports")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*, categories(*)")
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return mapReport(data);
  }
}
