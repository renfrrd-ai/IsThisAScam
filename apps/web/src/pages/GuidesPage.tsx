import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useScams";
import { AlertTriangle, ShieldCheck, Lightbulb, Search, BookOpen } from "lucide-react";
import { Loading } from "@/components/States";
import { GUIDES } from "@/data/guides";

const iconMap: Record<string, React.ComponentType<any>> = {
  AlertTriangle,
  ShieldCheck,
  Lightbulb,
  Search,
  BookOpen,
};

const colorMap: Record<string, string> = {
  yellow: "border-yellow-500/30 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300",
  cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-300",
  green: "border-green-500/30 bg-green-500/10 text-green-800 dark:text-green-300",
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300",
};

export function GuidesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">
          Educational Guides
        </h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          Learn how to protect yourself from scams with our educational resources.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {GUIDES.map((guide) => {
          const Icon = iconMap[guide.icon] || BookOpen;
          const colors = colorMap[guide.color] ?? colorMap.blue;
          return (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className={`group rounded-lg border p-6 transition hover:border-cyan-400/40 hover:bg-cyan-50 dark:hover:bg-slate-800/60 ${colors}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon size={24} />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {guide.readTime}
                </span>
              </div>
              <h2 className="mb-2 text-lg font-medium text-white group-hover:text-cyan-300">
                {guide.title}
              </h2>
              <p className="text-sm text-slate-400">{guide.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Tips Section */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold text-white">
          Quick Safety Tips
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "Never share OTPs or passwords with anyone",
            "Verify callers by calling official numbers",
            "Don't click links in unsolicited messages",
            "Research unknown contacts before sending money",
            "Check official websites directly, not via links",
            "When in doubt, ask someone you trust",
          ].map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-4"
            >
              <span className="mt-0.5 text-cyan-400">⚠</span>
              <span className="text-sm text-slate-300">{tip}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
