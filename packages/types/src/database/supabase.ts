export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      scams: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category_id: string;
          description: string;
          how_it_works: string;
          warning_signs: string[];
          example_messages: string[];
          prevention_steps: string[];
          recovery_steps: string[];
          emotional_triggers: string[];
          related_scam_slugs: string[];
          severity: Database["public"]["Enums"]["risk_level"];
          country: string | null;
          platform: string | null;
          status: Database["public"]["Enums"]["scam_status"];
          embedding: string | number[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category_id: string;
          description: string;
          how_it_works: string;
          warning_signs?: string[];
          example_messages?: string[];
          prevention_steps?: string[];
          recovery_steps?: string[];
          emotional_triggers?: string[];
          related_scam_slugs?: string[];
          severity?: Database["public"]["Enums"]["risk_level"];
          country?: string | null;
          platform?: string | null;
          status?: Database["public"]["Enums"]["scam_status"];
          embedding?: string | number[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["scams"]["Insert"]>;
      };
      reports: {
        Row: {
          id: string;
          title: string;
          category_id: string | null;
          description: string;
          message_text: string | null;
          platform: string;
          country: string | null;
          screenshot_url: string | null;
          contact_email: string | null;
          status: Database["public"]["Enums"]["report_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category_id?: string | null;
          description: string;
          message_text?: string | null;
          platform: string;
          country?: string | null;
          screenshot_url?: string | null;
          contact_email?: string | null;
          status?: Database["public"]["Enums"]["report_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
      };
      ai_checks: {
        Row: {
          id: string;
          input_text: string;
          risk_level: Database["public"]["Enums"]["risk_level"];
          ai_response: Json;
          matched_scams: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          input_text: string;
          risk_level?: Database["public"]["Enums"]["risk_level"];
          ai_response?: Json;
          matched_scams?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_checks"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      risk_level: "low" | "medium" | "high" | "unknown";
      scam_status: "draft" | "pending" | "approved" | "rejected";
      report_status: "pending" | "approved" | "rejected";
    };
    CompositeTypes: Record<string, never>;
  };
}
