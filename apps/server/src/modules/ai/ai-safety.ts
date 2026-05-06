/**
 * AI Safety Rules for ScamRadar
 *
 * These rules MUST be followed by all AI interactions.
 * The AI must never:
 * - Ask for passwords, OTPs, card numbers, government IDs, or banking credentials
 * - Encourage retaliation against scammers
 * - Generate instructions for executing scams
 * - Provide hacking or doxxing guidance
 * - Guarantee certainty about scam detection
 *
 * The AI MUST:
 * - Explain its reasoning
 * - Reference known scam patterns when possible
 * - Encourage verification through official channels
 * - Recommend caution and safe practices
 * - Handle uncertainty properly
 * - Avoid storing sensitive personal data
 */

import { SENSITIVE_DATA_PATTERNS, type SensitiveDataPattern } from "@scamradar/shared";

export const AI_SYSTEM_PROMPT = `You are ScamRadar AI, a helpful assistant that analyzes messages and situations for potential scam patterns.

YOUR PURPOSE:
- Help users identify potential scam patterns
- Educate about common scam techniques
- Provide cautious risk assessments
- Recommend safety best practices

STRICT RULES:
1. NEVER ask for passwords, OTPs, card numbers, PINs, government IDs, or banking credentials
2. NEVER encourage retaliation, hacking, doxxing, or revenge against scammers
3. NEVER provide instructions on how to execute scams
4. NEVER guarantee certainty - always use phrases like "likely", "possibly", "indicates"
5. ALWAYS explain your reasoning
6. ALWAYS reference specific warning signs or scam patterns you detect
7. ALWAYS recommend verifying through official channels
8. ALWAYS suggest the user report suspicious activity
9. NEVER store or repeat sensitive personal data in responses

RESPONSE FORMAT:
Return a JSON object with:
- riskLevel: "low", "medium", "high", or "unknown"
- explanation: Clear explanation of your analysis
- warningSigns: Array of detected warning signs
- safetyRecommendations: Array of actionable safety steps
- confidence: "low", "medium", or "high"
- similarPatterns: Brief mention of similar known scam types (if any)

Remember: You are educational and safety-focused. When in doubt, recommend caution.`;

export const SENSITIVE_DATA_WARNING =
  "Do not submit passwords, OTPs, card numbers, government IDs, or banking credentials.";

/**
 * Check if text contains sensitive data patterns
 * Returns sanitized version and flags if sensitive data was detected
 */
export function checkSensitiveData(text: string): {
  hasSensitiveData: boolean;
  sanitizedText: string;
  warning: string | null;
} {
  let hasSensitiveData = false;
  let sanitizedText = text;
  const warnings: string[] = [];

  for (const { pattern, description } of SENSITIVE_DATA_PATTERNS) {
    if (pattern.test(text)) {
      hasSensitiveData = true;
      warnings.push(`Possible ${description}`);
      sanitizedText = sanitizedText.replace(pattern, "[REDACTED]");
    }
  }

  return {
    hasSensitiveData,
    sanitizedText,
    warning:
      warnings.length > 0
        ? `Warning: Input may contain sensitive data (${warnings.join(", ")}). Please remove sensitive information.`
        : null,
  };
}

/**
 * Non-vector risk analysis using pattern matching
 * This provides initial risk assessment before AI analysis
 */
export function analyzeTextPatterns(text: string): {
  riskScore: number;
  detectedPatterns: string[];
  urgencyIndicators: string[];
  emotionalTriggers: string[];
} {
  const lowerText = text.toLowerCase();
  const detectedPatterns: string[] = [];
  const urgencyIndicators: string[] = [];
  const emotionalTriggers: string[] = [];
  let riskScore = 0;

  // Urgency language patterns
  const urgencyPatterns = [
    { pattern: /\b(urgent|immediately|asap|right now|hurry)\b/gi, label: "Urgency language" },
    { pattern: /\b(24 hours|48 hours|expires?|deadline|limited time)\b/gi, label: "Time pressure" },
    { pattern: /\b(act now|don't wait|before it's too late)\b/gi, label: "Pressure tactics" },
  ];

  for (const { pattern, label } of urgencyPatterns) {
    if (pattern.test(text)) {
      urgencyIndicators.push(label);
      riskScore += 1;
    }
  }

  // Money request patterns
  const moneyPatterns = [
    { pattern: /\b(pay|payment|transfer|send money|deposit)\b/gi, label: "Money transfer request" },
    { pattern: /\b(gift card|itunes|google play|steam wallet)\b/gi, label: "Gift card request" },
    { pattern: /\b(bitcoin|crypto|ethereum|usdt|binance)\b/gi, label: "Cryptocurrency request" },
    { pattern: /\$([0-9,]+(\.[0-9]{2})?)|([0-9]+ dollars?)\b/gi, label: "Specific amount mentioned" },
  ];

  for (const { pattern, label } of moneyPatterns) {
    if (pattern.test(text)) {
      detectedPatterns.push(label);
      riskScore += 2;
    }
  }

  // Credential request patterns
  const credentialPatterns = [
    { pattern: /\b(password|pwd|login)\b/gi, label: "Password request" },
    { pattern: /\b(otp|verification code|2fa|two-factor)\b/gi, label: "OTP/2FA request" },
    { pattern: /\b(card number|cvv|pin|expiry)\b/gi, label: "Card/banking details request" },
    { pattern: /\b(ssn|social security|passport|driver'?s? license)\b/gi, label: "ID document request" },
  ];

  for (const { pattern, label } of credentialPatterns) {
    if (pattern.test(text)) {
      detectedPatterns.push(label);
      riskScore += 3;
    }
  }

  // Impersonation patterns
  const impersonationPatterns = [
    { pattern: /\b(ceo|director|manager|hr|human resources)\b/gi, label: "Authority impersonation" },
    { pattern: /\b(bank|paypal|apple|microsoft|amazon|netflix)\b.*\b(support|security|verify)\b/gi, label: "Company impersonation" },
    { pattern: /\b(government|irs|tax|customs|immigration)\b/gi, label: "Government impersonation" },
    { pattern: /\b(prince|inheritance|lottery|winner)\b/gi, label: "Advance-fee scam language" },
  ];

  for (const { pattern, label } of impersonationPatterns) {
    if (pattern.test(text)) {
      detectedPatterns.push(label);
      riskScore += 2;
    }
  }

  // Emotional manipulation
  const emotionalPatterns = [
    { pattern: /\b(fear|scared|worried|threat|legal action|police|arrest)\b/gi, label: "Fear-based manipulation" },
    { pattern: /\b(love|darling|sweetheart|miss you)\b/gi, label: "Romance scam language" },
    { pattern: /\b(congratulations|you've been selected|exclusive|special offer)\b/gi, label: "Too-good-to-be-true language" },
  ];

  for (const { pattern, label } of emotionalPatterns) {
    if (pattern.test(text)) {
      emotionalTriggers.push(label);
      riskScore += 1;
    }
  }

  // Suspicious links
  if (/\b(bit\.ly|tinyurl|t\.co|goo\.gl|short\.link)\b/gi.test(text) || /https?:\/\/[^\s]+/gi.test(text)) {
    detectedPatterns.push("Contains links (verify before clicking)");
    riskScore += 1;
  }

  return {
    riskScore: Math.min(riskScore, 10),
    detectedPatterns,
    urgencyIndicators,
    emotionalTriggers,
  };
}

export function getRiskLevel(score: number): "low" | "medium" | "high" | "unknown" {
  if (score <= 2) return "low";
  if (score <= 5) return "medium";
  return "high";
}
