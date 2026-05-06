import { Link, Route, Routes } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { APP_NAME, SENSITIVE_DATA_WARNING } from "@scamradar/shared";
import { Button } from "./components/Button";

function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100">
            <ShieldCheck size={16} aria-hidden="true" />
            Safety-first scam awareness
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              Check suspicious messages before you trust them.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              {APP_NAME} helps people learn scam patterns, search known scam
              techniques, report suspicious activity, and get cautious AI
              analysis.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/check">Check a Message</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/library">Browse Library</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/30">
          <label
            htmlFor="scam-check-preview"
            className="text-sm font-medium text-slate-200"
          >
            AI Scam Checker
          </label>
          <textarea
            id="scam-check-preview"
            className="mt-3 min-h-40 w-full resize-none rounded-md border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 outline-none ring-cyan-400/30 transition focus:ring-4"
            placeholder="Paste a suspicious message or describe the situation..."
          />
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {SENSITIVE_DATA_WARNING}
          </p>
          <Button className="mt-4 w-full">Analyze Risk</Button>
        </div>
      </section>
    </main>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        This route is scaffolded for the MVP and will be implemented in the
        next phases.
      </p>
    </main>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="text-cyan-300" size={22} aria-hidden="true" />
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <Link className="hover:text-white" to="/library">
              Library
            </Link>
            <Link className="hover:text-white" to="/report">
              Report
            </Link>
            <Link className="hover:text-white" to="/check">
              AI Check
            </Link>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<PlaceholderPage title="Scam Library" />} />
        <Route path="/report" element={<PlaceholderPage title="Report a Scam" />} />
        <Route path="/check" element={<PlaceholderPage title="AI Scam Checker" />} />
      </Routes>
    </div>
  );
}

