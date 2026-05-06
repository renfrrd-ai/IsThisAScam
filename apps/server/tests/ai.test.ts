import { describe, it, expect, beforeEach, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@scamradar/types";
import { analyzeTextPatterns, checkSensitiveData } from "../src/modules/ai/ai-safety";
import { AiService } from "../src/modules/ai/ai.service";

describe("AI Safety - Pattern Detection", () => {
  it("should detect urgency language", () => {
    const result = analyzeTextPatterns("Act now! This is urgent and expires in 24 hours!");
    expect(result.urgencyIndicators).toContain("Urgency language");
    expect(result.riskScore).toBeGreaterThan(0);
  });

  it("should detect money requests", () => {
    const result = analyzeTextPatterns("Please send $500 via Bitcoin to this address");
    expect(result.detectedPatterns).toContain("Money transfer request");
    expect(result.detectedPatterns).toContain("Cryptocurrency request");
  });

  it("should detect credential requests", () => {
    const result = analyzeTextPatterns("Please provide your password and OTP code");
    expect(result.detectedPatterns).toContain("Password request");
    expect(result.detectedPatterns).toContain("OTP/2FA request");
  });

  it("should detect impersonation", () => {
    const result = analyzeTextPatterns("This is Apple Support and we need to verify your account");
    expect(result.detectedPatterns).toContain("Company impersonation");
  });

  it("should assign correct risk levels", () => {
    const lowRisk = analyzeTextPatterns("Hello, how are you?");
    expect(lowRisk.riskScore).toBeLessThanOrEqual(2);

    const medRisk = analyzeTextPatterns("Urgent! Act now or your account will be deleted");
    expect(medRisk.riskScore).toBeGreaterThan(2);
    expect(medRisk.riskScore).toBeLessThanOrEqual(5);

    const highRisk = analyzeTextPatterns(
      "Urgent! Send $500 via Bitcoin now! Provide your password and OTP. I am from Apple Support.",
    );
    expect(highRisk.riskScore).toBeGreaterThan(5);
  });
});

describe("AI Safety - Sensitive Data", () => {
  it("should detect sensitive data", () => {
    const result = checkSensitiveData("My card number is 1234-5678-9012-3456");
    expect(result.hasSensitiveData).toBe(true);
    expect(result.warning).not.toBeNull();
    expect(result.sanitizedText).toContain("[REDACTED]");
  });

  it("should not flag clean text", () => {
    const result = checkSensitiveData("This is a normal message about a job opportunity");
    expect(result.hasSensitiveData).toBe(false);
    expect(result.warning).toBeNull();
  });
});

describe("AiService", () => {
  let mockSupabase: SupabaseClient<Database>;
  let aiService: AiService;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      rpc: vi.fn(),
    } as unknown as SupabaseClient<Database>;

    aiService = new AiService(mockSupabase);
  });

  it("should perform non-vector analysis", async () => {
    const result = await aiService.analyzeText("Urgent! Send money now!");
    expect(result.riskLevel).toBeDefined();
    expect(result.explanation).toBeDefined();
    expect(result.warningSigns).toBeDefined();
    expect(result.safetyRecommendations).toBeDefined();
  });

  it("should reject sensitive data", async () => {
    const result = await aiService.analyzeText("My password is secret123");
    expect(result.riskLevel).toBe("unknown");
    expect(result.explanation).toContain("sensitive");
  });
});
