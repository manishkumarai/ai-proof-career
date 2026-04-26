import { ChevronLeft, ChevronRight, CirclePlay, X } from "lucide-react";
import type { LiveSession, Week } from "../lib/types";

type PresentationModeProps = {
  liveSession: LiveSession;
  week: Week;
  onClose: () => void;
  onNext: () => Promise<void>;
  onPrevious: () => Promise<void>;
  onTrigger: () => Promise<void>;
};

export function PresentationMode({
  liveSession,
  week,
  onClose,
  onNext,
  onPrevious,
  onTrigger
}: PresentationModeProps) {
  const slides = [
    { title: week.title, body: week.theme },
    { title: "Session A", body: week.sessionABody.join(" ") },
    { title: "Session B", body: week.sessionBBody },
    { title: "Deliverable", body: week.deliverable },
    { title: "Async Follow-through", body: week.asyncContent }
  ];

  const activeSlide = slides[Math.min(liveSession.presentationIdx, slides.length - 1)];

  return (
    <div className="fixed inset-0 z-50 bg-[#0a1613] text-white">
      <button onClick={onClose} className="absolute right-6 top-6 rounded-full bg-white/10 p-3 transition hover:bg-white/20">
        <X size={20} />
      </button>
      <div className="flex min-h-screen flex-col justify-between px-8 py-12 lg:px-16">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Week {week.id} • Session {liveSession.sessionType}
          </p>
          <h2 className="mt-10 max-w-5xl text-5xl font-semibold leading-tight lg:text-7xl">{activeSlide.title}</h2>
          <p className="mt-8 max-w-4xl text-xl leading-9 text-white/75 lg:text-2xl">{activeSlide.body}</p>
          {liveSession.activityTitle ? (
            <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Live Activity</p>
              <h3 className="mt-2 text-2xl font-semibold">{liveSession.activityTitle}</h3>
              <p className="mt-3 text-base text-white/70">
                {String(liveSession.activityBody?.prompt ?? "Triggered for students")}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-white/60">
            Slide {Math.min(liveSession.presentationIdx + 1, slides.length)} of {slides.length}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => void onPrevious()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              onClick={() => void onTrigger()}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950"
            >
              <CirclePlay size={16} />
              Trigger Activity
            </button>
            <button
              onClick={() => void onNext()}
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
