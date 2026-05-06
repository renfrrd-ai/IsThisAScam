export const APP_NAME = "ScamRadar";

export const SENSITIVE_DATA_WARNING =
  "Do not submit passwords, OTPs, card numbers, government IDs, or banking credentials.";

export const DEFAULT_PORT = 4000;

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

