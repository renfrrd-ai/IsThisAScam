import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@scamradar/types";
import { requireSupabaseEnv } from "../config/env";

let cachedClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const env = requireSupabaseEnv();

  cachedClient = createClient<Database>(env.url, env.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

