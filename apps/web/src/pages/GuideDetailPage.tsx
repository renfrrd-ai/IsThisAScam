import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/Button";
import { getGuideBySlug, type Guide } from "@/data/guides";

export function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const guide: Guide | undefined = getGuideBySlug(slug || "");

  if (!guide) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <h1 className="mb-4 text-2xl font-semibold text-slate-950 dark:text-white">
            Guide Not Found
          </h1>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            The guide you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/guides">
            <Button variant="secondary">
              <ArrowLeft size={16} className="mr-2" />
              Back to Guides
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link
        to="/guides"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
      >
        <ArrowLeft size={14} />
        Back to Guides
      </Link>

      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <BookOpen size={14} />
          <span>{guide.readTime}</span>
        </div>

        <h1 className="mb-4 text-3xl font-semibold text-slate-950 dark:text-white">
          {guide.title}
        </h1>
        <p className="mb-8 text-lg text-slate-700 dark:text-slate-300">{guide.description}</p>

        <div className="prose prose-invert prose-slate max-w-none">
          {guide.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="mt-8 mb-4 text-xl font-semibold text-slate-950 dark:text-white"
                >
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("### ")) {
              return (
                <h3
                  key={i}
                  className="mt-6 mb-3 text-lg font-medium text-slate-800 dark:text-slate-200"
                >
                  {line.replace("### ", "")}
                </h3>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <div
                  key={i}
                  className="ml-4 flex items-start gap-2 text-slate-700 dark:text-slate-300"
                >
                  <Shield size={14} className="mt-1 shrink-0 text-cyan-400" />
                  {line.replace("- ", "")}
                </div>
              );
            }
            if (line.trim() === "") {
              return <br key={i} />;
            }
            if (line.includes("**") && line.includes("**", line.indexOf("**") + 2)) {
              const parts = line.split("**");
              return (
                <p key={i} className="my-3 text-slate-700 dark:text-slate-300">
                  {parts.map((part, j) =>
                    j % 2 === 1 ? (
                      <strong key={j} className="text-slate-950 dark:text-white">
                        {part}
                      </strong>
                    ) : (
                      part
                    ),
                  )}
                </p>
              );
            }
            return (
              <p key={i} className="my-3 text-slate-700 dark:text-slate-300">
                {line}
              </p>
            );
          })}
        </div>

        <div className="mt-8 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-2 text-sm text-yellow-900 dark:text-yellow-200">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>
              Remember: This guide is for educational purposes. If you've been
              scammed, report it to local authorities and the platform where it
              occurred.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
