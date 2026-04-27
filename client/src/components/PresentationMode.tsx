import { ChevronLeft, ChevronRight, CirclePlay, X } from "lucide-react";
import type { LiveSession, Week } from "../lib/types";

type PresentationModeProps = {
  session: LiveSession;
  onClose: () => void;
  onUpdateSlide: (idx: number) => Promise<void>;
  onTriggerActivity: (title: string, body: Record<string, unknown>) => Promise<void>;
};

export function PresentationMode({
  session,
  onClose,
  onUpdateSlide,
  onTriggerActivity
}: PresentationModeProps) {
  const week = session.week;
  const slides = [
    { title: week.title, body: week.theme },
    { title: "Session A", body: week.sessionABody.join(" ") },
    { title: "Session B", body: week.sessionBBody },
    { title: "Deliverable", body: week.deliverable },
    { title: "Async Follow-through", body: week.asyncContent }
  ];

  const activeSlide = slides[Math.min(session.presentationIdx, slides.length - 1)];

  const handleNext = async () => {
    const nextIdx = Math.min(session.presentationIdx + 1, slides.length - 1);
    await onUpdateSlide(nextIdx);
  };

  const handlePrevious = async () => {
    const prevIdx = Math.max(session.presentationIdx - 1, 0);
    await onUpdateSlide(prevIdx);
  };

  const handleTrigger = async () => {
    await onTriggerActivity("Demo Activity", { prompt: "This is a demo activity on your device only" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a1613] text-white">
      {/* Local-only disclaimer */}
      <div className="absolute top-0 left-0 right-0 bg-amber-950/50 border-b border-amber-700/30 px-8 py-3">
        <p className="text-xs text-amber-200">
          ⚠️ Demo Mode: This presentation is local to YOUR device only. Use screen-sharing (Zoom, Teams, Meet) to teach the cohort.
        </p>
      </div>

      <button onClick={onClose} className="absolute right-6 top-20 rounded-full bg-white/10 p-3 transition hover:bg-white/20">
        <X size={20} />
      </button>
      
      <div className="flex min-h-screen flex-col justify-between px-8 py-20 lg:px-16">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Week {week.id} • Session {session.sessionType}
          </p>
          <h2 className="mt-10 max-w-5xl text-5xl font-semibold leading-tight lg:text-7xl">{activeSlide.title}</h2>
          <p className="mt-8 max-w-4xl text-xl leading-9 text-white/75 lg:text-2xl">{activeSlide.body}</p>
          {session.activityTitle ? (
            <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Demo Activity</p>
              <h3 className="mt-2 text-2xl font-semibold">{session.activityTitle}</h3>
              <p className="mt-3 text-base text-white/70">
                {String(session.activityBody?.prompt ?? "Demo activity triggered")}
              </p>
              <p className="mt-3 text-xs text-white/50">
                In production, this would broadcast to students. For now, use screen-sharing.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-white/60">
            Slide {Math.min(session.presentationIdx + 1, slides.length)} of {slides.length}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => void handlePrevious()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              onClick={() => void handleTrigger()}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950"
            >
              <CirclePlay size={16} />
              Demo Activity
            </button>
            <button
              onClick={() => void handleNext()}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)]"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
