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

export function sanitizePlainText(value: string) {
  return value
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>]/g, "") // Remove < and > characters
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sanitize HTML content - strip all tags and dangerous content
 */
export function sanitizeHtml(value: string): string {
  return value
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validate URL - ensure it's a valid HTTP/HTTPS URL
 */
export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validate file upload - check type and size
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileUpload(
  fileName: string,
  fileSize: number,
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
): FileValidationResult {
  // Check file extension
  const ext = fileName.split(".").pop()?.toLowerCase();
  const validExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!ext || !validExtensions.includes(ext)) {
    return { valid: false, error: "Only image files (JPG, PNG, WebP, GIF) are allowed" };
  }

  // Check file size
  if (fileSize > maxSizeBytes) {
    const maxMB = Math.floor(maxSizeBytes / (1024 * 1024));
    return { valid: false, error: `File size must be under ${maxMB}MB` };
  }

  return { valid: true };
}

/**
 * Patterns to detect sensitive data that should not be submitted
 */
export const SENSITIVE_DATA_PATTERNS = [
  {
    pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    description: "possible card number" as const,
  },
  {
    pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
    description: "possible SSN" as const,
  },
  {
    pattern: /\b(?:password|pwd|pass)\s*[:=]\s*\S+/gi,
    description: "possible password" as const,
  },
  {
    pattern: /\b\d{4,6}\b/g,
    description: "possible OTP code" as const,
  },
  {
    pattern: /\b[0-9]{5,}\s*(?:cvv|cvc|cvv2?)\b/gi,
    description: "possible CVV" as const,
  },
] as const;

export type SensitiveDataPattern = (typeof SENSITIVE_DATA_PATTERNS)[number];
