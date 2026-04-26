import { GraduationCap, LayoutDashboard, LogOut, MonitorPlay, UserCircle2 } from "lucide-react";
import type { User, Week } from "../lib/types";

type SidebarProps = {
  user: User;
  weeks: Week[];
  selectedWeekId: number;
  onSelectWeek: (id: number) => void;
  onLogout: () => void;
};

export function Sidebar({ user, weeks, selectedWeekId, onSelectWeek, onLogout }: SidebarProps) {
  return (
    <aside className="glass card-shadow flex h-full flex-col rounded-[2rem] p-5">
      <div className="rounded-[1.5rem] bg-[var(--ink)] p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            {user.role === "facilitator" ? <MonitorPlay size={20} /> : <GraduationCap size={20} />}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/70">Cohort Mode</p>
            <p className="text-lg font-semibold capitalize">{user.role}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/8 p-3">
          <UserCircle2 size={18} />
          <div>
            <p className="text-xs text-white/65">Logged in as</p>
            <p className="text-sm font-medium">{user.name}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">
          <LayoutDashboard size={14} />
          Program Weeks
        </div>
        <div className="space-y-2">
          {weeks.map((week) => (
            <button
              key={week.id}
              onClick={() => onSelectWeek(week.id)}
              className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                week.id === selectedWeekId
                  ? "bg-[var(--accent)] text-white"
                  : "bg-white/70 text-[var(--ink)] hover:bg-white"
              }`}
            >
              <div className="text-xs uppercase tracking-[0.2em] opacity-75">Week {week.id}</div>
              <div className="mt-1 text-sm font-semibold">{week.title.split(" - ")[0]}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center justify-center gap-2 rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--ink)]"
      >
        <LogOut size={16} />
        End session
      </button>
    </aside>
  );
}
