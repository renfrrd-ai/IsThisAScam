import type {
  Category,
  ScamSummary,
  ScamDetail,
  ScamSearchFilters,
  ScamReport,
  AiCheckResponse,
} from "@scamradar/types";

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function getCategories() {
  return request<Category[]>("/categories");
}

export function getScams(filters?: ScamSearchFilters) {
  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.platform) params.set("platform", filters.platform);
  if (filters?.country) params.set("country", filters.country);
  if (filters?.phrase) params.set("phrase", filters.phrase);
  const qs = params.toString();
  return request<ScamSummary[]>(`/scams${qs ? `?${qs}` : ""}`);
}

export function getScamBySlug(slug: string) {
  return request<ScamDetail>(`/scams/${slug}`);
}

export function searchScams(filters: ScamSearchFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.platform) params.set("platform", filters.platform);
  if (filters.country) params.set("country", filters.country);
  if (filters.phrase) params.set("phrase", filters.phrase);
  return request<ScamSummary[]>(`/search?${params.toString()}`);
}

export function submitReport(
  data: Omit<ScamReport, "id" | "status" | "createdAt">,
) {
  return request<ScamReport>("/reports", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function checkScam(inputText: string) {
  return request<AiCheckResponse>("/ai/check", {
    method: "POST",
    body: JSON.stringify({ inputText }),
  });
}
