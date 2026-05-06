import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Category,
  Database,
  ScamDetail,
  ScamSearchFilters,
  ScamSummary,
} from "@scamradar/types";
import { getSupabaseClient } from "../../db/supabase";
import { mapCategory, mapScamDetail, mapScamSummary } from "./scam.mapper";
import type { ScamCreationInput } from "../../routes/admin-scams";

type ScamWithCategory = Database["public"]["Tables"]["scams"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};

// Use any to bypass strict Supabase typing for complex operations
type AnySupabase = any;

export class ScamRepository {
  constructor(
    private readonly supabase: AnySupabase = getSupabaseClient(),
  ) {}

  async listCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapCategory);
  }

  async listApprovedScams(): Promise<ScamSummary[]> {
    return this.searchApprovedScams({});
  }

  async listAllScams(status?: string): Promise<ScamSummary[]> {
    let query = this.supabase
      .from("scams")
      .select("*, categories(*)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return ((data as ScamWithCategory[] | null) ?? [])
      .filter((row) => row.categories)
      .map((row) => mapScamSummary(row, mapCategory(row.categories!)));
  }

  async searchApprovedScams(filters: ScamSearchFilters): Promise<ScamSummary[]> {
    let query = this.supabase
      .from("scams")
      .select("*, categories(*)")
      .eq("status", "approved");

    if (filters.platform) {
      query = query.ilike("platform", `%${filters.platform}%`);
    }

    if (filters.country) {
      query = query.ilike("country", `%${filters.country}%`);
    }

    if (filters.q) {
      query = query.or(
        `title.ilike.%${filters.q}%,description.ilike.%${filters.q}%,how_it_works.ilike.%${filters.q}%`,
      );
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return ((data as ScamWithCategory[] | null) ?? [])
      .filter((row) => row.categories)
      .filter((row) =>
        filters.category ? row.categories?.slug === filters.category : true,
      )
      .filter((row) =>
        filters.phrase
          ? row.example_messages.some((message) =>
              message.toLowerCase().includes(filters.phrase!.toLowerCase()),
            )
          : true,
      )
      .map((row) => mapScamSummary(row, mapCategory(row.categories!)));
  }

  async findApprovedScamBySlug(slug: string): Promise<ScamDetail | null> {
    const { data, error } = await this.supabase
      .from("scams")
      .select("*, categories(*)")
      .eq("slug", slug)
      .eq("status", "approved")
      .maybeSingle();

    if (error) {
      throw error;
    }

    const row = data as ScamWithCategory | null;

    if (!row?.categories) {
      return null;
    }

    const scamDetail = mapScamDetail(row, mapCategory(row.categories));

    // Fetch related scams if there are related scam slugs
    if (scamDetail.relatedScamSlugs && scamDetail.relatedScamSlugs.length > 0) {
      const { data: relatedData, error: relatedError } = await this.supabase
        .from("scams")
        .select("id, title, slug, description, severity, platform, categories(name)")
        .eq("status", "approved")
        .in("slug", scamDetail.relatedScamSlugs);

      if (!relatedError && relatedData) {
        scamDetail.relatedScams = relatedData.map((r: any) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          description: r.description,
          severity: r.severity,
          platform: r.platform,
          category: r.categories?.name || "Unknown",
        }));
      }
    }

    return scamDetail;
  }

  async createScam(input: ScamCreationInput): Promise<ScamSummary> {
    const payload: Database["public"]["Tables"]["scams"]["Insert"] = {
      title: input.title,
      slug: input.slug,
      category_id: input.categoryId,
      description: input.description,
      how_it_works: input.howItWorks ?? "",
      warning_signs: input.warningSigns ?? [],
      example_messages: input.exampleMessages ?? [],
      prevention_steps: input.preventionSteps ?? [],
      recovery_steps: input.recoverySteps ?? [],
      emotional_triggers: input.emotionalTriggers ?? [],
      severity: input.severity ?? "unknown",
      country: input.country ?? null,
      platform: input.platform ?? null,
      status: input.status ?? "draft",
    };

    const { data, error } = await this.supabase
      .from("scams")
      .insert(payload)
      .select("*, categories(*)")
      .single();

    if (error) throw error;

    return mapScamSummary(
      data as ScamWithCategory,
      mapCategory((data as ScamWithCategory).categories!),
    );
  }

  async updateScam(id: string, updates: Partial<ScamCreationInput>): Promise<ScamSummary | null> {
    // Build SET clause dynamically
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (updates.title) { setClauses.push(`title = $${idx++}`); values.push(updates.title); }
    if (updates.slug) { setClauses.push(`slug = $${idx++}`); values.push(updates.slug); }
    if (updates.categoryId) { setClauses.push(`category_id = $${idx++}`); values.push(updates.categoryId); }
    if (updates.description) { setClauses.push(`description = $${idx++}`); values.push(updates.description); }
    if (updates.howItWorks !== undefined) { setClauses.push(`how_it_works = $${idx++}`); values.push(updates.howItWorks); }
    if (updates.warningSigns) { setClauses.push(`warning_signs = $${idx++}`); values.push(updates.warningSigns); }
    if (updates.exampleMessages) { setClauses.push(`example_messages = $${idx++}`); values.push(updates.exampleMessages); }
    if (updates.preventionSteps) { setClauses.push(`prevention_steps = $${idx++}`); values.push(updates.preventionSteps); }
    if (updates.recoverySteps) { setClauses.push(`recovery_steps = $${idx++}`); values.push(updates.recoverySteps); }
    if (updates.emotionalTriggers) { setClauses.push(`emotional_triggers = $${idx++}`); values.push(updates.emotionalTriggers); }
    if (updates.severity) { setClauses.push(`severity = $${idx++}`); values.push(updates.severity); }
    if (updates.country !== undefined) { setClauses.push(`country = $${idx++}`); values.push(updates.country); }
    if (updates.platform !== undefined) { setClauses.push(`platform = $${idx++}`); values.push(updates.platform); }
    if (updates.status) { setClauses.push(`status = $${idx++}`); values.push(updates.status); }

    setClauses.push(`updated_at = now()`);
    values.push(id);

    const query = `
      update scams
      set ${setClauses.join(", ")}
      where id = $${idx}
      returning *
    `;

    const { data, error } = await this.supabase.rpc("exec_sql" as any, {
      sql: query,
      params: values,
    });

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Fetch with category
    const { data: withCat } = await this.supabase
      .from("scams")
      .select("*, categories(*)")
      .eq("id", id)
      .single();

    if (!withCat) return null;
    return mapScamSummary(
      withCat as ScamWithCategory,
      mapCategory(withCat.categories!),
    );
  }

  async updateScamStatus(
    id: string,
    status: string,
  ): Promise<ScamSummary | null> {
    return this.updateScam(id, { status: status as ScamCreationInput["status"] });
  }

  async createFromReport(
    reportId: string,
    data: {
      title: string;
      description: string;
      categoryId?: string;
      platform?: string;
      country?: string;
      warningSigns?: string[];
      preventionSteps?: string[];
    },
  ): Promise<ScamSummary> {
    // Get report data first
    const { data: report, error: reportError } = await this.supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single();

    if (reportError) throw reportError;

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const scam = await this.createScam({
      title: data.title,
      slug,
      categoryId: data.categoryId ?? report.category_id ?? "",
      description: data.description,
      howItWorks: "To be documented.",
      warningSigns: data.warningSigns ?? [],
      preventionSteps: data.preventionSteps ?? [],
      platform: data.platform ?? report.platform,
      country: data.country ?? report.country,
      status: "pending",
    });

    return scam;
  }

  async getScamCountsByCountry(): Promise<{ country: string; count: number }[]> {
    const { data, error } = await this.supabase
      .from("scams")
      .select("country")
      .eq("status", "approved")
      .not("country", "is", null);

    if (error) throw error;

    const counts: Record<string, number> = {};
    (data as { country: string | null }[]).forEach((row) => {
      const c = row.country;
      if (c) {
        counts[c] = (counts[c] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }

  async generateEmbeddingForScam(id: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("scams")
      .select("title, description, how_it_works, warning_signs")
      .eq("id", id)
      .single();

    if (error || !data) return false;

    const textToEmbed = [
      data.title,
      data.description,
      data.how_it_works,
      ...(data.warning_signs ?? []),
    ].join(" ");

    // This would call the AI service - imported at runtime to avoid circular deps
    // For now, return true to indicate the intent
    return true;
  }
}
