import { useMutation } from "@tanstack/react-query";
import type { ScamReport } from "@scamradar/types";
import { submitReport } from "@/lib/api-client";

export function useSubmitReport() {
  return useMutation({
    mutationFn: (
      data: Omit<ScamReport, "id" | "status" | "createdAt">,
    ) => submitReport(data),
  });
}
