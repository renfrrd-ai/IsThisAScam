import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { BarChart3, Globe, ArrowLeft } from "lucide-react";
import { useScams } from "@/hooks/useScams";
import { Loading } from "@/components/States";

interface CountryTrend {
  country: string;
  total: number;
  high: number;
  medium: number;
  low: number;
  categories: { name: string; count: number }[];
}

export function TrendsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCountry = searchParams.get("country") || "all";
  const { data: scams = [], isLoading } = useScams({});

  const trends = useMemo(() => {
    const countryMap: Record<string, CountryTrend> = {};

    scams.forEach((scam) => {
      const country = scam.country || "Unknown";
      if (!countryMap[country]) {
        countryMap[country] = {
          country,
          total: 0,
          high: 0,
          medium: 0,
          low: 0,
          categories: [],
        };
      }
      const trend = countryMap[country];
      trend.total++;
      const severity = scam.severity || "low";
      if (severity === "high") trend.high++;
      else if (severity === "medium") trend.medium++;
      else trend.low++;

      const catName = scam.category?.name || "Unknown";
      const existingCat = trend.categories.find((c) => c.name === catName);
      if (existingCat) existingCat.count++;
      else trend.categories.push({ name: catName, count: 1 });
    });

    return Object.values(countryMap)
      .sort((a, b) => b.total - a.total)
      .map((t) => ({
        ...t,
        categories: t.categories.sort((a, b) => b.count - a.count),
      }));
  }, [scams]);

  const filteredTrends =
    selectedCountry === "all"
      ? trends
      : trends.filter(
          (t) => t.country.toLowerCase() === selectedCountry.toLowerCase(),
        );

  const countries = ["all", ...trends.map((t) => t.country)];

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <Loading message="Loading scam trends..." />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-semibold text-white">
          <BarChart3 className="text-cyan-400" size={24} />
          Scam Trends by Country
        </h1>
        <p className="mt-2 text-slate-300">
          Explore scam patterns and statistics across different regions.
        </p>
      </div>

      {/* Country Filter */}
      <div className="mb-8">
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
          <Globe size={14} />
          Filter by Country
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            if (e.target.value === "all") params.delete("country");
            else params.set("country", e.target.value);
            setSearchParams(params, { replace: true });
          }}
          className="w-full max-w-xs rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-cyan-400/50"
          aria-label="Filter by country"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Countries" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Trends Grid */}
      <div className="space-y-6">
        {filteredTrends.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No data available for the selected country.
            </p>
          </div>
        )}

        {filteredTrends.map((trend) => (
          <div
            key={trend.country}
            className="rounded-lg border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-medium text-white">
                {trend.country}
              </h2>
              <span className="rounded bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {trend.total} scams
              </span>
            </div>

            {/* Severity Breakdown */}
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-center">
                <div className="text-2xl font-bold text-red-400">
                  {trend.high}
                </div>
                <div className="text-xs text-slate-400">High Risk</div>
              </div>
              <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {trend.medium}
                </div>
                <div className="text-xs text-slate-400">Medium Risk</div>
              </div>
              <div className="rounded-md border border-cyan-500/30 bg-cyan-500/10 p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {trend.low}
                </div>
                <div className="text-xs text-slate-400">Low Risk</div>
              </div>
            </div>

            {/* Top Categories */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-slate-300">
                Top Categories
              </h3>
              <div className="space-y-2">
                {trend.categories.slice(0, 5).map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between rounded bg-slate-950/60 px-3 py-2"
                  >
                    <span className="text-sm text-slate-300">{cat.name}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
