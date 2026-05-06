import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Search, AlertTriangle, BookOpen, Bot } from "lucide-react";
import { APP_NAME, SENSITIVE_DATA_WARNING } from "@scamradar/shared";
import { Button } from "@/components/Button";
import { useScams } from "@/hooks/useScams";

export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: scams = [] } = useScams();
  const featured = scams.slice(0, 3);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/library?q=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      {/* Hero */}
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-800 dark:text-cyan-100">
            <ShieldCheck size={16} />
            Safety-first scam awareness
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-5xl">
            Check suspicious messages before you trust them.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
            {APP_NAME} helps people learn scam patterns, search known scam
            techniques, report suspicious activity, and get cautious AI analysis.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/check">Check a Message</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/library">Browse Library</Link>
            </Button>
          </div>
        </div>

        {/* AI Checker Preview */}
        <div className="rounded-lg border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-cyan-950/30">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Bot size={16} />
            AI Scam Checker
          </div>
          <form onSubmit={(e) => { e.preventDefault(); navigate("/check"); }}>
            <textarea
              className="min-h-40 w-full resize-none rounded-md border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900 outline-none ring-cyan-400/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Paste a suspicious message or describe the situation..."
              readOnly
              onClick={() => navigate("/check")}
            />
          </form>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {SENSITIVE_DATA_WARNING}
          </p>
          <Button
            className="mt-4 w-full"
            onClick={() => navigate("/check")}
          >
            Analyze Risk
          </Button>
        </div>
      </section>

      {/* Search */}
      <section className="mt-16">
        <form onSubmit={handleSearch} className="relative mx-auto max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scam types, keywords, or platforms..."
            className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none ring-cyan-400/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </form>
      </section>

      {/* Featured Scams */}
      {featured.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold text-slate-950 dark:text-white">
            Featured Scam Alerts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((scam) => (
              <Link
                key={scam.id}
                to={`/scam/${scam.slug}`}
                className="group rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-400/40 hover:bg-cyan-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
              >
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle
                    size={16}
                    className={
                      scam.severity === "high"
                        ? "text-red-400"
                        : scam.severity === "medium"
                          ? "text-yellow-400"
                          : "text-cyan-400"
                    }
                  />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {scam.category.name}
                  </span>
                </div>
                <h3 className="font-medium text-slate-900 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                  {scam.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                  {scam.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Educational Highlights */}
      <section className="mt-16 mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-slate-950 dark:text-white">
          Learn to Protect Yourself
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: AlertTriangle,
              title: "Spot Warning Signs",
              desc: "Learn the red flags that appear in most scam attempts.",
            },
            {
              icon: Search,
              title: "Search Known Scams",
              desc: "Look up scam techniques by category, platform, or keyword.",
            },
            {
              icon: BookOpen,
              title: "Report & Alert Others",
              desc: "Submit scam reports to help build a safer community.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-lg border border-slate-200 bg-white/90 p-5 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <Icon size={20} className="mb-3 text-cyan-400" />
              <h3 className="mb-1 font-medium text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
