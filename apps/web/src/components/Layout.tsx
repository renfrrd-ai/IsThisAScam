import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Sun, Moon } from "lucide-react";
import { APP_NAME } from "@scamradar/shared";
import { Button } from "./Button";
import { useTheme } from "../contexts/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const nav = [
    { to: "/library", label: "Library" },
    { to: "/scam-types", label: "Scam Types" },
    { to: "/resources", label: "Resources" },
    { to: "/trends", label: "Trends" },
    { to: "/report", label: "Report" },
    { to: "/check", label: "AI Check" },
    { to: "/guides", label: "Guides" },
    { to: "/how-it-works", label: "How It Works" },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header
        className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90"
        role="banner"
      >
        <nav
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 rounded"
          >
            <ShieldCheck className="text-cyan-600 dark:text-cyan-300" size={22} aria-hidden="true" />
            <span className="sr-only">Home</span>
            <span aria-hidden="true">{APP_NAME}</span>
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            {nav.map(({ to, label }) => (
              <Button
                key={to}
                asChild
                variant={pathname === to ? "primary" : "secondary"}
                className="h-9 px-3 text-sm"
                aria-current={pathname === to ? "page" : undefined}
              >
                <Link to={to} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 rounded">
                  {label}
                </Link>
              </Button>
            ))}
            <Button
              variant="secondary"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
          <MobileNav
            nav={nav}
            current={pathname}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </nav>
      </header>
      <main className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          © {new Date().getFullYear()} {APP_NAME}. Educational purposes only.
        </div>
      </footer>
    </div>
  );
}

function MobileNav({
  nav,
  current,
  theme,
  toggleTheme,
}: {
  nav: { to: string; label: string }[];
  current: string;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  return (
    <div className="flex items-center gap-2 sm:hidden">
      <Button
        variant="secondary"
        onClick={toggleTheme}
        className="h-9 w-9 p-0"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
      <select
        className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        value={current}
        onChange={(e) => (window.location.href = e.target.value)}
        aria-label="Navigate to page"
      >
        <option value="/">Home</option>
        {nav.map(({ to, label }) => (
          <option key={to} value={to}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Accessibility: Skip to main content link
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 rounded bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950"
    >
      Skip to main content
    </a>
  );
}
