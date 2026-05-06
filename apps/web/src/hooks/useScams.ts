import { useQuery } from "@tanstack/react-query";
import type {
  Category,
  ScamSummary,
  ScamDetail,
  ScamSearchFilters,
} from "@scamradar/types";
import {
  getCategories,
  getScams,
  getScamBySlug,
  searchScams,
} from "@/lib/api-client";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useScams(filters?: ScamSearchFilters) {
  return useQuery<ScamSummary[]>({
    queryKey: ["scams", filters],
    queryFn: () => getScams(filters),
  });
}

export function useScamBySlug(slug: string) {
  return useQuery<ScamDetail>({
    queryKey: ["scams", slug],
    queryFn: () => getScamBySlug(slug),
    enabled: slug.length > 0,
  });
}

export function useSearchScams(filters: ScamSearchFilters) {
  return useQuery<ScamSummary[]>({
    queryKey: ["search", filters],
    queryFn: () => searchScams(filters),
    enabled: Object.values(filters).some((v) => v && v.length > 0),
  });
}
