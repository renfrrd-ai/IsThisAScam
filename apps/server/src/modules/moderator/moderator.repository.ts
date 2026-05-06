// Use any to bypass type issues with new table
type AnySupabase = any;

export interface ModeratorApplicationData {
  name: string;
  email: string;
  reason: string;
  experience?: string;
  availability?: string;
}

export class ModeratorApplicationRepository {
  constructor(private readonly supabase: AnySupabase) {}

  async create(data: ModeratorApplicationData): Promise<Record<string, unknown>> {
    const { data: result, error } = await this.supabase
      .from("moderator_applications")
      .insert({
        name: data.name,
        email: data.email,
        reason: data.reason,
        experience: data.experience || null,
        availability: data.availability || null,
      })
      .select("*")
      .single();

    if (error) throw error;
    return result;
  }

  async list(status?: string): Promise<Record<string, unknown>[]> {
    let query = this.supabase
      .from("moderator_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async updateStatus(
    id: string,
    status: "approved" | "rejected",
    adminNotes?: string,
  ): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.supabase
      .from("moderator_applications")
      .update({
        status,
        admin_notes: adminNotes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
}
