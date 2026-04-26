import { Crown, RefreshCcw } from "lucide-react";
import type { Submission } from "../lib/types";

type SubmissionFeedProps = {
  submissions: Submission[];
  title: string;
  refreshLabel?: string;
  onRefresh?: () => Promise<void>;
};

export function SubmissionFeed({ submissions, title, refreshLabel, onRefresh }: SubmissionFeedProps) {
  return (
    <section className="glass card-shadow rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">Polling-backed feed of the latest cohort work.</p>
        </div>
        {onRefresh ? (
          <button
            onClick={() => void onRefresh()}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
          >
            <RefreshCcw size={14} />
            {refreshLabel ?? "Refresh"}
          </button>
        ) : null}
      </div>

      <div className="mt-5 space-y-3">
        {submissions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">
            No submissions yet for this view.
          </div>
        ) : (
          submissions.map((submission) => {
            const summary = Object.values(submission.content).flat().join(" ").slice(0, 180);
            return (
              <article key={submission.id} className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {submission.user.name} • Week {submission.weekId}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{submission.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {submission.user.topPerformer ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        <Crown size={12} />
                        Top Performer
                      </span>
                    ) : null}
                    {submission.score ? (
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                        {submission.score}/100
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{summary || "Structured JSON submission saved."}</p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
