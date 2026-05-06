import { z } from "zod";
import { DEFAULT_PORT } from "@scamradar/shared";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  ADMIN_API_KEY: z.string().min(1).optional(),
  ALLOWED_ORIGINS: z.string().optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

export function getServerEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  return envSchema.parse(source);
}

export function requireSupabaseEnv(source: NodeJS.ProcessEnv = process.env) {
  const env = getServerEnv(source);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to the server environment.",
    );
  }

  return {
    url: env.SUPABASE_URL,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

