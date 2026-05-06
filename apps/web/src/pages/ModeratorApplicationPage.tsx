import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/Button";

export function ModeratorApplicationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    experience: "",
    availability: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.reason) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would call an API endpoint
      // For now, simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-8 text-center">
          <ShieldCheck size={48} className="mx-auto mb-4 text-green-400" />
          <h1 className="mb-2 text-2xl font-semibold text-white">
            Application Received!
          </h1>
          <p className="mb-6 text-slate-300">
            Thank you for your interest in becoming a ScamRadar moderator. We'll
            review your application and contact you at {formData.email} if there's a
            match.
          </p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-semibold text-white">
          <Users size={28} className="text-cyan-400" />
          Become a Moderator
        </h1>
        <p className="mt-2 text-slate-300">
          Help protect the community by reviewing and moderating scam reports. This
          is an unpaid community service role with no fees required.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 text-lg font-medium text-white">
          What Moderators Do
        </h2>
        <ul className="mb-6 space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">⚠</span>
            Review user-submitted scam reports
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">⚠</span>
            Approve or reject reports based on guidelines
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">⚠</span>
            Convert approved reports into scam library entries
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400">⚠</span>
            Help maintain a safe, educational platform
          </li>
        </ul>

        <div className="mb-6 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
          <strong>Note:</strong> This is a volunteer community service role. There
          are no fees to apply or participate.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-200">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900 p-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400/50"
              placeholder="Your full name"
              aria-label="Full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-200">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900 p-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400/50"
              placeholder="your@email.com"
              aria-label="Email address"
            />
          </div>

          <div>
            <label htmlFor="reason" className="mb-1 block text-sm font-medium text-slate-200">
              Why do you want to be a moderator? *
            </label>
            <textarea
              id="reason"
              name="reason"
              required
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900 p-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400/50"
              placeholder="Tell us why you'd like to help..."
              aria-label="Reason for applying"
            />
          </div>

          <div>
            <label htmlFor="experience" className="mb-1 block text-sm font-medium text-slate-200">
              Relevant Experience (optional)
            </label>
            <textarea
              id="experience"
              name="experience"
              rows={3}
              value={formData.experience}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900 p-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400/50"
              placeholder="Any relevant experience with fraud prevention, community moderation, etc."
              aria-label="Relevant experience"
            />
          </div>

          <div>
            <label htmlFor="availability" className="mb-1 block text-sm font-medium text-slate-200">
              Availability (optional)
            </label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900 p-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-cyan-400/50"
              aria-label="Availability"
            >
              <option value="">Select...</option>
              <option value="a-few-hours-week">A few hours per week</option>
              <option value="5-10-hours-week">5-10 hours per week</option>
              <option value="10-plus-hours-week">10+ hours per week</option>
            </select>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </main>
  );
}
