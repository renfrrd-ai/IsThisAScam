export type RiskLevel = "low" | "medium" | "high" | "unknown";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
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
}

export interface ApiHealth {
  status: "ok";
  service: "scamradar-api";
}

