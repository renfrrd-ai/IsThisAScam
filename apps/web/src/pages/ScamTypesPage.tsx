import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useScams";
import { AlertTriangle, Shield, Search, FileText } from "lucide-react";
import { Loading } from "@/components/States";

const categoryIcons: Record<string, React.ComponentType<any>> = {
  romance: AlertTriangle,
  crypto: AlertTriangle,
  banking: AlertTriangle,
  job: AlertTriangle,
  scholarship: AlertTriangle,
  phishing: AlertTriangle,
  marketplace: AlertTriangle,
  "fake-support": AlertTriangle,
  recovery: AlertTriangle,
  investment: AlertTriangle,
  "government-tax": AlertTriangle,
  rental: AlertTriangle,
  charity: AlertTriangle,
  "business-invoice": AlertTriangle,
  "loan-debt": AlertTriangle,
  "prize-lottery": AlertTriangle,
  "travel-ticket": AlertTriangle,
  "social-media": AlertTriangle,
  malware: AlertTriangle,
  "remote-access": AlertTriangle,
};

const categoryDescriptions: Record<string, string> = {
  romance: "Fake relationships built online to steal money and emotions.",
  crypto: "Fake investments, rug pulls, and impersonation in crypto.",
  banking: "Impersonation of banks, fake fraud alerts, and account takeovers.",
  job: "Fake jobs requiring upfront payments or personal documents.",
  scholarship: "Fake scholarships and grants that request fees or data.",
  phishing: "Emails or messages stealing credentials via fake login pages.",
  marketplace: "Fake buyers/sellers on eBay, Craigslist, Facebook Marketplace.",
  "fake-support": "Scammers pretending to be tech support or company representatives.",
  recovery: "Fake services claiming they can recover lost money or crypto.",
  investment: "Promises of guaranteed high returns with little or no risk.",
  "government-tax": "Fake IRS, tax, or government agency impersonation.",
  rental: "Fake rental listings requesting deposits for properties that don't exist.",
  charity: "Fake charities exploiting disasters or emotional causes.",
  "business-invoice": "Fake invoices or supplier changes targeting businesses.",
  "loan-debt": "Advance-fee loans or debt relief scams requiring upfront payment.",
  "prize-lottery": "Notifications that you won a prize you never entered.",
  "travel-ticket": "Fake travel deals, concert tickets, or vacation rentals.",
  "social-media": "Impersonation of friends, celebrities, or brands on social platforms.",
  malware: "Fake software, downloads, or links that install malicious software.",
  "remote-access": "Scammers requesting access to your computer for 'support'.",
};

export function ScamTypesPage() {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <Loading message="Loading scam types..." />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Scam Types</h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          Browse scam types by category. Click any card to see real examples and
          learn how to protect yourself.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category.slug] || AlertTriangle;
          return (
            <Link
              key={category.id}
              to={`/library?category=${category.slug}`}
              className="group rounded-lg border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400/40 hover:bg-slate-800/60"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon
                  size={20}
                  className="text-cyan-400 group-hover:text-cyan-300"
                />
                <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {category.name}
                </span>
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300">
                {categoryDescriptions[category.slug] || "Learn about this scam type."}
              </p>
            </Link>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">
            No scam types available yet. Check back soon for updates.
          </p>
        </div>
      )}
    </main>
  );
}
