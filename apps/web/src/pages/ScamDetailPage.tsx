import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, ShieldCheck, Lightbulb, FileText } from "lucide-react";
import { Button } from "@/components/Button";
import { useScamBySlug } from "@/hooks/useScams";

const severityStyles: Record<string, string> = {
  high: "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300",
  medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300",
  low: "border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-300",
  unknown: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-400",
};

export function ScamDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: scam, isLoading, error } = useScamBySlug(slug ?? "");

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 text-slate-400 sm:px-6">
        Loading scam details...
      </main>
    );
  }

  if (error || !scam) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <Link to="/library" className="text-cyan-400 hover:underline">
          ← Back to Library
        </Link>
        <p className="mt-4 text-red-400">
          Failed to load scam details. The scam may not exist or has been
          removed.
        </p>
      </main>
    );
  }

  const sev = scam.severity ?? "unknown";

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
      <Link
        to="/library"
        className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:underline"
      >
        <ArrowLeft size={14} /> Back to Library
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-wrap items-start gap-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${severityStyles[sev]}`}
        >
          <AlertTriangle size={14} />
          {sev.charAt(0).toUpperCase() + sev.slice(1)} Risk
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {scam.category.name}
        </span>
        {scam.platform && (
          <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {scam.platform}
          </span>
        )}
        {scam.country && (
          <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {scam.country}
          </span>
        )}
      </div>

      <h1 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{scam.title}</h1>

      {/* Description */}
      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-slate-950 dark:text-white">
          <FileText size={18} /> Description
        </h2>
        <p className="leading-7 text-slate-700 dark:text-slate-300">{scam.description}</p>
      </section>

      {/* How It Works */}
      {scam.howItWorks && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-slate-950 dark:text-white">
            <ShieldCheck size={18} /> How It Works
          </h2>
          <p className="leading-7 text-slate-700 dark:text-slate-300">{scam.howItWorks}</p>
        </section>
      )}

      {/* Warning Signs */}
      {scam.warningSigns.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-slate-950 dark:text-white">
            <AlertTriangle size={18} /> Warning Signs
          </h2>
          <ul className="space-y-2">
            {scam.warningSigns.map((sign, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-md border border-slate-200 bg-white/90 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
              >
                <span className="mt-0.5 text-cyan-400">⚠</span>
                {sign}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Example Messages */}
      {scam.exampleMessages.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-medium text-slate-950 dark:text-white">
            Example Messages
          </h2>
          <div className="space-y-3">
            {scam.exampleMessages.map((msg, i) => (
              <blockquote
                key={i}
                className="border-l-4 border-cyan-400/40 bg-slate-50 p-4 text-sm italic text-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
              >
                "{msg}"
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Prevention Steps */}
      {scam.preventionSteps.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-slate-950 dark:text-white">
            <ShieldCheck size={18} /> Prevention Advice
          </h2>
          <ul className="space-y-2">
            {scam.preventionSteps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xs text-cyan-700 dark:text-cyan-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recovery Steps */}
      {scam.recoverySteps.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-slate-950 dark:text-white">
            <Lightbulb size={18} /> Recovery Advice
          </h2>
          <ul className="space-y-2">
            {scam.recoverySteps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-400/10 text-xs text-green-700 dark:text-green-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Scams */}
      {scam.relatedScams && scam.relatedScams.length > 0 && (
        <section className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="mb-4 text-lg font-medium text-slate-950 dark:text-white">
            Related Scams
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scam.relatedScams.map((related) => (
              <Link
                key={related.id}
                to={`/scam/${related.slug}`}
                className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-cyan-400/40 hover:bg-cyan-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
              >
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle
                    size={12}
                    className={
                      related.severity === "high"
                        ? "text-red-400"
                        : related.severity === "medium"
                          ? "text-yellow-400"
                          : "text-cyan-400"
                    }
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {related.category}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-950 line-clamp-2 dark:text-white">
                  {related.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2 dark:text-slate-400">
                  {related.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Report CTA */}
      <section className="mt-10 rounded-lg border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-none">
        <h3 className="text-lg font-medium text-slate-950 dark:text-white">
          Seen something like this?
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Report a scam to help others stay safe.
        </p>
        <Button asChild className="mt-4">
          <Link to="/report">Report a Scam</Link>
        </Button>
      </section>
    </main>
  );
}
