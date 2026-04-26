import { Clock3, FolderCheck, Wrench } from "lucide-react";
import type { Week } from "../lib/types";

type WeekCardProps = {
  week: Week;
  completed: boolean;
};

export function WeekCard({ week, completed }: WeekCardProps) {
  return (
    <section className="glass card-shadow rounded-[2rem] p-6 lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Week {week.id}</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight">{week.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">{week.theme}</p>
        </div>
        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {completed ? "Completed" : "In progress"}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <Clock3 size={16} />
            Session A
          </div>
          <h3 className="mt-2 text-lg font-semibold">{week.sessionATheme}</h3>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--muted)]">
            {week.sessionABody.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <FolderCheck size={16} />
            Session B + Deliverable
          </div>
          <h3 className="mt-2 text-lg font-semibold">{week.sessionBTheme}</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{week.sessionBBody}</p>
          <div className="mt-4 rounded-2xl bg-[var(--accent-soft)] p-4 text-sm text-[var(--ink)]">
            <span className="font-semibold">Deliverable:</span> {week.deliverable}
          </div>
        </article>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
          <Wrench size={16} />
          Tools Used + Async
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {week.toolsUsed.map((tool) => (
            <span key={tool} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              {tool}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{week.asyncContent}</p>
      </div>
    </section>
  );
}
