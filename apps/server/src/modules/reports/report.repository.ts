import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizePlainText } from "@scamradar/shared";
import type { Database, ScamReport } from "@scamradar/types";
import { getSupabaseClient } from "../../db/supabase";
import type { ReportSubmission } from "./report.validation";
import { mapReport } from "./report.mapper";

export class ReportRepository {
  constructor(
    private readonly supabase: SupabaseClient<Database> = getSupabaseClient(),
  ) {}

  async createPendingReport(input: ReportSubmission): Promise<ScamReport> {
    const payload: Database["public"]["Tables"]["reports"]["Insert"] = {
      title: sanitizePlainText(input.title),
      category_id: input.categoryId,
      description: sanitizePlainText(input.description),
      message_text: input.messageText ? sanitizePlainText(input.messageText) : null,
      platform: sanitizePlainText(input.platform),
      country: input.country ? sanitizePlainText(input.country) : null,
      screenshot_url: input.screenshotUrl ?? null,
      contact_email: input.contactEmail ?? null,
      status: "pending",
    };

    // Supabase's generated insert typing can collapse here; keep the cast local.
    const reportsTable = this.supabase.from("reports") as unknown as {
      insert: (value: Database["public"]["Tables"]["reports"]["Insert"]) => {
        select: (columns: string) => {
          single: () => Promise<{
            data: Database["public"]["Tables"]["reports"]["Row"];
            error: { message: string } | null;
          }>;
        };
      };
    };

    const { data, error } = await reportsTable
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapReport(data);
  }
}
