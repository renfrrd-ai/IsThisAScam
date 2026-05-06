import { Link } from "react-router-dom";
import { ShieldCheck, Bot, FileText, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/Button";

export function HowItWorksPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-semibold text-white">
          How ScamRadar Works
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          A transparent look at our features, limitations, and how we protect our
          community.
        </p>
      </div>

      {/* What We Do */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
          <ShieldCheck className="text-cyan-400" size={24} />
          What We Do
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "Scam Library",
              description:
                "A searchable database of known scam types with detailed breakdowns, warning signs, and prevention advice.",
            },
            {
              title: "AI Scam Checker",
              description:
                "Analyze suspicious messages or situations using AI pattern detection and vector similarity search against our scam database.",
            },
            {
              title: "Community Reporting",
              description:
                "Users can report new scams, which are then reviewed by moderators before being added to the public library.",
            },
            {
              title: "Educational Guides",
              description:
                "Learn to recognize scams, protect yourself, and help others who may be victims.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-6"
            >
              <h3 className="mb-2 text-lg font-medium text-white">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How AI Works */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
          <Bot className="text-cyan-400" size={24} />
          How AI Analysis Works
        </h2>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <ol className="space-y-4">
            {[
              "You paste a suspicious message or describe a situation",
              "Our AI generates an embedding (vector representation) of your text",
              "We search our vector database for similar known scams",
              "Top matching scams are included in the AI's context",
              "AI generates a risk assessment with explanation and recommendations",
              "You receive a structured response with risk level, warning signs, and safety advice",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm text-cyan-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-sm text-yellow-200">
              <AlertTriangle size={14} className="inline mr-1" />
              <strong>Important:</strong> Our AI provides educational analysis only. It
              cannot guarantee whether something is a scam, recover lost funds, or
              act as law enforcement. Always verify independently.
            </p>
          </div>
        </div>
      </section>

      {/* Moderation */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
          <Users className="text-cyan-400" size={24} />
          Moderation Process
        </h2>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <p className="mb-4 text-slate-300">
            All user reports go through a moderation process before becoming public:
          </p>
          <div className="space-y-3">
            {[
              "User submits a scam report with details",
              "Report enters 'pending' status in our system",
              "Admin moderators review the report for validity",
              "If approved: converted to scam entry and published to library",
              "If rejected: user is not penalized, report is archived",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400"></span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
          <FileText className="text-cyan-400" size={24} />
          Privacy & Safety
        </h2>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <ul className="space-y-3">
            {[
              "We never store sensitive data (passwords, OTPs, full card numbers)",
              "AI analysis truncates input to 1000 characters for privacy",
              "All user input is sanitized before storage",
              "Reports are private until approved by moderators",
              "We use rate limiting to prevent spam and abuse",
              "Our AI is programmed to refuse generating scam instructions",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-0.5 text-cyan-400">⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-lg border border-cyan-400/30 bg-cyan-400/5 p-8 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Want to Help the Community?
        </h2>
        <p className="mb-6 text-slate-300">
          We're looking for volunteer moderators to help review and approve scam
          reports. It's unpaid community service that helps protect others.
        </p>
        <Button asChild>
          <Link to="/moderator-application">Become a Moderator</Link>
        </Button>
      </section>
    </main>
  );
}
