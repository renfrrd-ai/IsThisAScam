export const APP_NAME = "ScamRadar";

export const SENSITIVE_DATA_WARNING =
  "Do not submit passwords, OTPs, card numbers, government IDs, or banking credentials.";

export const DEFAULT_PORT = 4000;

export const SCAM_CATEGORY_SEEDS = [
  { name: "Romance", slug: "romance" },
  { name: "Crypto", slug: "crypto" },
  { name: "Banking", slug: "banking" },
  { name: "Job", slug: "job" },
  { name: "Scholarship", slug: "scholarship" },
  { name: "Phishing", slug: "phishing" },
  { name: "Marketplace", slug: "marketplace" },
  { name: "Fake Support", slug: "fake-support" },
] as const;

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
