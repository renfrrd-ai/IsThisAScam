import { useState } from "react";
import { Bot, AlertTriangle, ShieldCheck, Lightbulb, Loader2 } from "lucide-react";
import { SENSITIVE_DATA_WARNING } from "@scamradar/shared";
import { Button } from "@/components/Button";
import { checkScam } from "@/lib/api-client";
import type { AiCheckResponse } from "@scamradar/types";
import { Loading, ErrorState } from "@/components/States";

const severityStyles: Record<string, string> = {
  high: "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300",
  medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300",
  low: "border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-300",
  unknown: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-400",
};

export function CheckPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await checkScam(text.trim());
      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setText("");
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <Loading message="Analyzing message for scam patterns..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <ErrorState
          title="Analysis Failed"
          message={error}
          onRetry={() => {
            handleSubmit(new Event("submit") as any);
          }}
        />
      </main>
    );
  }

  if (result) {
    const sev = result.riskLevel ?? "unknown";
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-none sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-lg font-medium text-cyan-700 dark:text-cyan-300">
            <Bot size={20} />
            AI Analysis Result
          </div>

          {/* Risk Level */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Risk Level
            </h3>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${severityStyles[sev]}`}
            >
              <ShieldCheck size={14} />
              {sev.charAt(0).toUpperCase() + sev.slice(1)} Risk
              {result.confidence && (
                <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {result.confidence} confidence
                </span>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Analysis
            </h3>
            <p className="leading-7 text-slate-700 dark:text-slate-300">{result.explanation}</p>
          </div>

          {/* Warning Signs */}
          {result.warningSigns.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <AlertTriangle size={14} />
                Detected Warning Signs
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.warningSigns.map((sign: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-900 dark:text-yellow-200"
                  >
                    {sign}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Safety Recommendations */}
          {result.safetyRecommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Lightbulb size={14} />
                Safety Recommendations
              </h3>
              <ul className="space-y-2">
                {result.safetyRecommendations.map((rec: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xs text-cyan-700 dark:text-cyan-300">
                      {i + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Similar Scams */}
          {result.similarScams.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Similar Known Scams
              </h3>
              <div className="space-y-2">
                {result.similarScams.map(
                  (scam: { title: string; slug: string; similarity?: number }, i: number,
                ) => (
                  <a
                    key={i}
                    href={`/scam/${scam.slug}`}
                    className="block rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-cyan-800 hover:underline dark:border-slate-800 dark:bg-slate-950/60 dark:text-cyan-300"
                  >
                    {scam.title}
                    {scam.similarity && (
                      <span className="ml-2 text-xs text-slate-500 dark:text-slate-500">
                        {(scam.similarity * 100).toFixed(0)}% match
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <Button variant="secondary" onClick={reset} className="w-full">
            Check Another Message
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="flex items-center gap-2 text-3xl font-semibold text-slate-950 dark:text-white">
        <Bot size={24} /> AI Scam Checker
      </h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        Paste a suspicious message or describe a situation. Our AI will analyze
        it for scam patterns and provide a risk assessment.
      </p>

      <div className="mt-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-900 dark:text-yellow-200">
        <AlertTriangle size={14} className="inline mr-1" />
        {SENSITIVE_DATA_WARNING}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the suspicious message or describe what happened..."
          rows={8}
          className="w-full rounded-lg border border-slate-300 bg-white p-4 text-sm text-slate-900 outline-none ring-cyan-400/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <Button
          type="submit"
          disabled={!text.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Analyzing...
            </span>
          ) : (
            "Analyze Risk"
          )}
        </Button>
      </form>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white/90 p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <h3 className="mb-3 text-sm font-medium text-slate-800 dark:text-slate-200">
          What we look for
        </h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">⚠</span>
            Urgency language and pressure tactics
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">⚠</span>
            Requests for money, gift cards, or crypto
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">⚠</span>
            Impersonation of officials or companies
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">⚠</span>
            Emotional manipulation or threats
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">⚠</span>
            Suspicious links or attachments
          </li>
        </ul>
      </div>
    </main>
  );
}
