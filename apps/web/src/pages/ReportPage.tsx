import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, AlertTriangle, CheckCircle } from "lucide-react";
import { SENSITIVE_DATA_WARNING } from "@scamradar/shared";
import { Button } from "@/components/Button";
import { useCategories } from "@/hooks/useScams";
import { useSubmitReport } from "@/hooks/useReports";

const PLATFORMS = [
  "WhatsApp",
  "Telegram",
  "Instagram",
  "Facebook",
  "Email",
  "SMS",
  "Phone",
  "LinkedIn",
  "Other",
];

export function ReportPage() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const { mutate, isPending, isSuccess, isError, error } = useSubmitReport();

  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    description: "",
    messageText: "",
    platform: "",
    country: "",
    contactEmail: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.platform) {
      return;
    }
    mutate(
      {
        title: form.title.trim(),
        categoryId: form.categoryId || undefined,
        description: form.description.trim(),
        messageText: form.messageText.trim() || undefined,
        platform: form.platform,
        country: form.country.trim() || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
      },
      {
        onSuccess: () => {
          setForm({
            title: "",
            categoryId: "",
            description: "",
            messageText: "",
            platform: "",
            country: "",
            contactEmail: "",
          });
        },
      },
    );
  }

  if (isSuccess) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-8 text-center">
          <CheckCircle
            size={48}
            className="mx-auto mb-4 text-green-400"
          />
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Report Submitted
          </h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            Thank you for your report. It will be reviewed by our moderation team
            before being published.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate("/")}>Back to Home</Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Submit Another
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="flex items-center gap-2 text-3xl font-semibold text-slate-950 dark:text-white">
        <ShieldCheck size={24} /> Report a Scam
      </h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        Help others by reporting suspicious activity. All reports are moderated
        before publication.
      </p>

      <div className="mt-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-900 dark:text-yellow-200">
        <AlertTriangle size={14} className="inline mr-1" />
        {SENSITIVE_DATA_WARNING}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Brief description of the scam"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 outline-none ring-cyan-400/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe what happened, how the scam works, and any warning signs..."
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 outline-none ring-cyan-400/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Message Text */}
        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
            Suspicious Message
          </label>
          <textarea
            value={form.messageText}
            onChange={(e) => update("messageText", e.target.value)}
            placeholder="Paste the suspicious message you received..."
            rows={3}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 outline-none ring-cyan-400/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Platform & Country */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
              Platform <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={form.platform}
              onChange={(e) => update("platform", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select platform</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
              Country
            </label>
            <input
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="e.g. Nigeria, US, UK"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 outline-none ring-cyan-400/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
            Contact Email
          </label>
          <input
            type="email"
            value={form.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
            placeholder="Optional: if you want updates on your report"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 outline-none ring-cyan-400/30 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Error */}
        {isError && (
          <p className="text-sm text-red-400">
            {(error as Error)?.message ?? "Failed to submit report. Please try again."}
          </p>
        )}

        {/* Submit */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </main>
  );
}
