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

type ScamWithCategory = Database["public"]["Tables"]["scams"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};

export class ScamRepository {
  constructor(
    private readonly supabase: SupabaseClient<Database> = getSupabaseClient(),
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

    return mapScamDetail(row, mapCategory(row.categories));
  }
}
