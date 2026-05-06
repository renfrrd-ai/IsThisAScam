import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ScamSummary } from "@scamradar/types";
import { getRiskLevel, analyzeTextPatterns, checkSensitiveData } from "./ai-safety";
import type { AiCheckLogInput } from "./ai-check.validation";

export interface AiCheckResult {
  riskLevel: "low" | "medium" | "high" | "unknown";
  explanation: string;
  warningSigns: string[];
  safetyRecommendations: string[];
  confidence: "low" | "medium" | "high";
  similarScams: Array<{ title: string; slug: string; similarity?: number }>;
  matchedPatterns: string[];
  urgencyIndicators: string[];
  emotionalTriggers: string[];
}

export interface EmbeddingResult {
  embedding: number[];
  success: boolean;
  error?: string;
}

export class AiService {
  private supabase: SupabaseClient<Database>;
  private openaiApiKey?: string;
  private openaiBaseUrl: string;

  constructor(
    supabase: SupabaseClient<Database>,
    openaiApiKey?: string,
  ) {
    this.supabase = supabase;
    this.openaiApiKey = openaiApiKey;
    this.openaiBaseUrl = "https://api.openai.com/v1";
  }

  /**
   * Perform non-vector risk analysis using pattern matching
   */
  async analyzeWithoutAI(inputText: string): Promise<AiCheckResult> {
    const sensitiveCheck = checkSensitiveData(inputText);
    const sanitizedText = sensitiveCheck.sanitizedText;
    const patterns = analyzeTextPatterns(sanitizedText);

    const riskLevel = getRiskLevel(patterns.riskScore);

    const explanation = this.buildPatternExplanation(patterns, riskLevel);
    const warningSigns = [
      ...patterns.detectedPatterns,
      ...patterns.urgencyIndicators,
    ];
    const safetyRecommendations = this.getSafetyRecommendations(riskLevel, patterns);

    return {
      riskLevel,
      explanation,
      warningSigns,
      safetyRecommendations,
      confidence: patterns.riskScore >= 4 ? "medium" : "low",
      similarScams: [],
      matchedPatterns: patterns.detectedPatterns,
      urgencyIndicators: patterns.urgencyIndicators,
      emotionalTriggers: patterns.emotionalTriggers,
    };
  }

  /**
   * Perform full AI analysis with optional vector search
   */
  async analyzeText(inputText: string): Promise<AiCheckResult> {
    // First, check for sensitive data
    const sensitiveCheck = checkSensitiveData(inputText);
    if (sensitiveCheck.hasSensitiveData) {
      return {
        riskLevel: "unknown",
        explanation: sensitiveCheck.warning ?? "Input contains sensitive data. Please remove passwords, OTPs, card numbers, or personal identifiers before submitting.",
        warningSigns: ["Sensitive data detected"],
        safetyRecommendations: [
          "Remove all sensitive information from your message",
          "Never share passwords, OTPs, or banking details",
          "Resubmit with only the suspicious message content",
        ],
        confidence: "high",
        similarScams: [],
        matchedPatterns: [],
        urgencyIndicators: [],
        emotionalTriggers: [],
      };
    }

    // Pattern-based analysis (always runs)
    const patterns = analyzeTextPatterns(inputText);

    // Try vector search for similar scams
    let similarScams: Array<{ title: string; slug: string; similarity?: number }> = [];
    try {
      similarScams = await this.findSimilarScams(inputText);
    } catch {
      // Vector search failed, continue without it
    }

    // If OpenAI is configured, use it for enhanced analysis
    if (this.openaiApiKey) {
      try {
        return await this.analyzeWithAI(inputText, patterns, similarScams);
      } catch {
        // Fall back to pattern-based analysis
      }
    }

    // Return pattern-based result
    const riskLevel = getRiskLevel(patterns.riskScore);
    return {
      riskLevel,
      explanation: this.buildPatternExplanation(patterns, riskLevel),
      warningSigns: [...patterns.detectedPatterns, ...patterns.urgencyIndicators],
      safetyRecommendations: this.getSafetyRecommendations(riskLevel, patterns),
      confidence: patterns.riskScore >= 4 ? "medium" : "low",
      similarScams,
      matchedPatterns: patterns.detectedPatterns,
      urgencyIndicators: patterns.urgencyIndicators,
      emotionalTriggers: patterns.emotionalTriggers,
    };
  }

  /**
   * Generate embedding for a text using OpenAI
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    if (!this.openaiApiKey) {
      return { embedding: [], success: false, error: "OpenAI API key not configured" };
    }

    try {
      const response = await fetch(`${this.openaiBaseUrl}/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          input: text,
          model: "text-embedding-3-small",
          dimensions: 1536,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          embedding: [],
          success: false,
          error: error.error?.message ?? `OpenAI API error: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        embedding: data.data[0].embedding,
        success: true,
      };
    } catch (err) {
      return {
        embedding: [],
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  /**
   * Find similar scams using vector similarity search
   */
  async findSimilarScams(
    inputText: string,
    limit = 3,
  ): Promise<Array<{ title: string; slug: string; similarity?: number }>> {
    if (!this.openaiApiKey) return [];

    const embeddingResult = await this.generateEmbedding(inputText);
    if (!embeddingResult.success || embeddingResult.embedding.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase.rpc("match_scams", {
      query_embedding: embeddingResult.embedding,
      match_threshold: 0.7,
      match_count: limit,
    } as any);

    if (error || !data) return [];

    return (data as Array<{ title: string; slug: string; similarity: number }>).map(
      (row) => ({
        title: row.title,
        slug: row.slug,
        similarity: row.similarity,
      }),
    );
  }

  /**
   * Store embedding for a scam entry
   */
  async storeScamEmbedding(
    scamId: string,
    textToEmbed: string,
  ): Promise<boolean> {
    const result = await this.generateEmbedding(textToEmbed);
    if (!result.success) return false;

    // Use raw SQL to update vector column
    const { error } = await this.supabase
      .rpc("update_scam_embedding" as any, {
        p_scam_id: scamId,
        p_embedding: result.embedding,
      } as any);

    return !error;
  }

  /**
   * Log AI check to database
   */
  async logAiCheck(input: AiCheckLogInput): Promise<void> {
    try {
      await this.supabase.from("ai_checks").insert({
        input_text: input.inputText.substring(0, 1000),
        risk_level: input.riskLevel,
        ai_response: input.aiResponse as any,
        matched_scams: input.matchedScams as any,
      } as any);
    } catch {
      // Logging failure should not break the API response
    }
  }

  private async analyzeWithAI(
    inputText: string,
    patterns: ReturnType<typeof analyzeTextPatterns>,
    similarScams: AiCheckResult["similarScams"],
  ): Promise<AiCheckResult> {
    const contextText = similarScams.length > 0
      ? `\n\nSimilar known scams:\n${similarScams.map((s) => `- ${s.title}`).join("\n")}`
      : "";

    const prompt = `Analyze this message for scam patterns:\n\n"${inputText}"${contextText}\n\nReturn ONLY a JSON object with: riskLevel (low/medium/high/unknown), explanation (string), warningSigns (array of strings), safetyRecommendations (array of strings), confidence (low/medium/high).`;

    const response = await fetch(`${this.openaiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are ScamRadar AI, a helpful assistant that analyzes messages for scam patterns. Always return valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      const parsed = JSON.parse(content);
      return {
        riskLevel: parsed.riskLevel ?? getRiskLevel(patterns.riskScore),
        explanation: parsed.explanation ?? "Analysis completed using pattern matching.",
        warningSigns: parsed.warningSigns ?? patterns.detectedPatterns,
        safetyRecommendations: parsed.safetyRecommendations ?? this.getSafetyRecommendations(getRiskLevel(patterns.riskScore), patterns),
        confidence: parsed.confidence ?? "low",
        similarScams,
        matchedPatterns: patterns.detectedPatterns,
        urgencyIndicators: patterns.urgencyIndicators,
        emotionalTriggers: patterns.emotionalTriggers,
      };
    } catch {
      // If AI response isn't valid JSON, fall back to pattern analysis
      const riskLevel = getRiskLevel(patterns.riskScore);
      return {
        riskLevel,
        explanation: this.buildPatternExplanation(patterns, riskLevel),
        warningSigns: patterns.detectedPatterns,
        safetyRecommendations: this.getSafetyRecommendations(riskLevel, patterns),
        confidence: "low",
        similarScams,
        matchedPatterns: patterns.detectedPatterns,
        urgencyIndicators: patterns.urgencyIndicators,
        emotionalTriggers: patterns.emotionalTriggers,
      };
    }
  }

  private buildPatternExplanation(
    patterns: ReturnType<typeof analyzeTextPatterns>,
    riskLevel: string,
  ): string {
    const parts: string[] = [];

    parts.push(`Based on pattern analysis, this message shows a ${riskLevel} risk level.`);

    if (patterns.detectedPatterns.length > 0) {
      parts.push(`Detected patterns: ${patterns.detectedPatterns.join(", ")}.`);
    }

    if (patterns.urgencyIndicators.length > 0) {
      parts.push(`Urgency indicators: ${patterns.urgencyIndicators.join(", ")}.`);
    }

    if (patterns.emotionalTriggers.length > 0) {
      parts.push(`Emotional triggers: ${patterns.emotionalTriggers.join(", ")}.`);
    }

    parts.push("This analysis uses pattern matching and may not catch all scam techniques. When in doubt, verify through official channels.");

    return parts.join(" ");
  }

  private getSafetyRecommendations(
    riskLevel: string,
    patterns: ReturnType<typeof analyzeTextPatterns>,
  ): string[] {
    const recommendations: string[] = [];

    if (patterns.detectedPatterns.some((p) => p.includes("Money") || p.includes("Gift card") || p.includes("Cryptocurrency"))) {
      recommendations.push("Never send money, gift cards, or cryptocurrency to unknown parties");
    }

    if (patterns.detectedPatterns.some((p) => p.includes("Password") || p.includes("OTP") || p.includes("Card"))) {
      recommendations.push("Never share passwords, OTPs, or banking details");
    }

    if (patterns.detectedPatterns.some((p) => p.includes("Impersonation") || p.includes("Company") || p.includes("Government"))) {
      recommendations.push("Verify the sender through official channels before taking action");
    }

    recommendations.push("Take screenshots and report suspicious activity");
    recommendations.push("Search our scam library for similar patterns");

    if (riskLevel === "high") {
      recommendations.push("Block the sender and report to platform authorities");
    }

    recommendations.push("Remember: Legitimate organizations will never pressure you to act immediately");

    return recommendations;
  }
}

export function createAiService(
  supabase: SupabaseClient<Database>,
  openaiApiKey?: string,
): AiService {
  return new AiService(supabase, openaiApiKey);
}
