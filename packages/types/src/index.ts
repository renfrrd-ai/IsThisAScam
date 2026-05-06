export type RiskLevel = "low" | "medium" | "high" | "unknown";
export type ScamStatus = "draft" | "pending" | "approved" | "rejected";
export type ReportStatus = "pending" | "approved" | "rejected";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
}

export interface ScamSummary {
  id: string;
  title: string;
  slug: string;
  category: Category;
  description: string;
  severity: RiskLevel;
  country?: string;
  platform?: string;
  status?: ScamStatus;
  createdAt?: string;
}

export interface ScamDetail extends ScamSummary {
  howItWorks: string;
  warningSigns: string[];
  exampleMessages: string[];
  preventionSteps: string[];
  recoverySteps: string[];
  emotionalTriggers: string[];
  relatedScamSlugs: string[];
  updatedAt?: string;
}

export interface ScamReport {
  id: string;
  title: string;
  categoryId?: string;
  description: string;
  messageText?: string;
  platform: string;
  country?: string;
  screenshotUrl?: string;
  contactEmail?: string;
  status: ReportStatus;
  createdAt: string;
}

export interface AiCheckLog {
  id: string;
  inputText: string;
  riskLevel: RiskLevel;
  aiResponse: Record<string, unknown>;
  matchedScams: unknown[];
  createdAt: string;
}

export interface ApiHealth {
  status: "ok";
  service: "scamradar-api";
}

export * from "./database/supabase";
