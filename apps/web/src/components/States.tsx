import { useEffect } from "react";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
        <svg
          className="h-5 w-5 animate-spin text-cyan-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "Nothing found",
  description = "Try adjusting your filters or search terms.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-4xl" aria-hidden="true">📭</div>
      <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-slate-600 dark:text-slate-400">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      role="alert"
    >
      <div className="mb-4 text-4xl text-red-400" aria-hidden="true">⚠</div>
      <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-slate-600 dark:text-slate-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// Highlight matched text in search results
export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="rounded bg-cyan-500/15 px-0.5 text-cyan-800 dark:bg-cyan-400/20 dark:text-cyan-300">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
