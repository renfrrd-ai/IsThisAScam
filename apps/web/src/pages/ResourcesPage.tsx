import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Globe, Filter } from "lucide-react";
import {
  RESOURCES,
  getResourcesByCountry,
  getResourcesByScamType,
  COUNTRIES,
} from "@/data/resources";

const scamTypeFilters = [
  { value: "all", label: "All Types" },
  { value: "romance", label: "Romance Scams" },
  { value: "crypto", label: "Crypto Scams" },
  { value: "banking", label: "Banking Scams" },
  { value: "job", label: "Job Scams" },
  { value: "phishing", label: "Phishing" },
  { value: "investment", label: "Investment Scams" },
  { value: "government-tax", label: "Government/Tax" },
  { value: "recovery", label: "Recovery Scams" },
];

const typeColors: Record<string, string> = {
  reporting: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  information: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  support: "border-green-500/30 bg-green-500/10 text-green-400",
};

export function ResourcesPage() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedType, setSelectedType] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = RESOURCES.filter((r) => {
    const countryMatch =
      selectedCountry === "All" || r.country === selectedCountry;
    const typeMatch =
      selectedType === "all" ||
      r.scamTypes.includes(selectedType) ||
      r.scamTypes.includes("all");
    const searchMatch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return countryMatch && typeMatch && searchMatch;
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Reporting Resources</h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          Find official scam reporting agencies and support organizations by country
          and scam type.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full appearance-none rounded-md border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-100 focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Filter by country"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full appearance-none rounded-md border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-100 focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Filter by scam type"
          >
            {scamTypeFilters.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full rounded-md border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Search resources"
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No resources found. Try adjusting your filters.
            </p>
          </div>
        )}

        {filtered.map((resource) => {
          const colors = typeColors[resource.type] || typeColors.information;
          return (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-lg border p-5 transition hover:border-cyan-400/40 hover:bg-slate-800/60 ${colors}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-xs">
                  {resource.country}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-xs capitalize">
                  {resource.type}
                </span>
              </div>
              <h3 className="mb-1 text-lg font-medium text-white">
                {resource.name}
              </h3>
              <p className="text-sm text-slate-400">{resource.description}</p>
            </a>
          );
        })}
      </div>

      {/* Info Section */}
      <section className="mt-12 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-3 text-lg font-medium text-white">
          How to Report Scams
        </h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">1.</span>
            Gather evidence: screenshots, transaction IDs, communication logs
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">2.</span>
            Contact your bank/payment provider immediately if money was sent
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">3.</span>
            Report to the appropriate agency for your country (see links above)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">4.</span>
            Report the scammer's profile/platform to get them taken down
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">5.</span>
            Consider filing a police report for significant losses
          </li>
        </ul>
      </section>
    </main>
  );
}
