import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AlertTriangle, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/Button";
import { useScams, useCategories } from "@/hooks/useScams";
import { EmptyState, Loading, highlightText } from "@/components/States";

export function LibraryPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [platform, setPlatform] = useState(params.get("platform") ?? "");

  const { data: scams = [], isLoading } = useScams(
    useMemo(
      () => ({
        q: params.get("q") ?? undefined,
        category: params.get("category") ?? undefined,
        platform: params.get("platform") ?? undefined,
      }),
      [params],
    ),
  );
  const { data: categories = [] } = useCategories();

  const platforms = useMemo(
    () =>
      Array.from(
        new Set(scams.map((s) => s.platform).filter(Boolean)),
      ) as string[],
    [scams],
  );

  function applyFilters() {
    const next = new URLSearchParams();
    if (search.trim()) next.set("q", search.trim());
    if (category) next.set("category", category);
    if (platform) next.set("platform", platform);
    setParams(next, { replace: true });
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setPlatform("");
    setParams(new URLSearchParams(), { replace: true });
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Scam Library</h1>
      <p className="mt-2 max-w-2xl text-slate-700 dark:text-slate-300">
        Browse approved scam techniques, learn warning signs, and discover how to
        protect yourself.
      </p>

      {/* Filters */}
      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scams..."
            className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none ring-cyan-400/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Search scams"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-400/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-400/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          aria-label="Filter by platform"
        >
          <option value="">All Platforms</option>
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <Button onClick={applyFilters} className="h-10 px-4 text-sm">
            Filter
          </Button>
          {(search || category || platform) && (
            <Button
              variant="secondary"
              onClick={clearFilters}
              className="h-10 px-4 text-sm"
              aria-label="Clear all filters"
            >
              <X size={14} />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading && (
        <Loading message="Loading scams..." />
      )}

      {!isLoading && scams.length === 0 && (
        <EmptyState
          title="No scams found"
          description="Try adjusting your filters or search terms."
          action={
            (search || category || platform) && (
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            )
          }
        />
      )}

      {!isLoading && scams.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scams.map((scam) => (
            <Link
              key={scam.id}
              to={`/scam/${scam.slug}`}
              className="group rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-400/40 hover:bg-cyan-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
              aria-label={`View details for ${scam.title}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle
                  size={14}
                  className={
                    scam.severity === "high"
                      ? "text-red-400"
                      : scam.severity === "medium"
                        ? "text-yellow-400"
                        : "text-cyan-400"
                  }
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {scam.category.name}
                </span>
                {scam.platform && (
                  <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {scam.platform}
                  </span>
                )}
              </div>
              <h3 className="font-medium text-slate-900 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                {highlightText(scam.title, params.get("q") ?? "")}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                {highlightText(scam.description, params.get("q") ?? "")}
              </p>
            </Link>
          ))}
        </div>
      )}
      </main>
    );
  }
