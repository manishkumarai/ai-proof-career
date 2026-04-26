import { useEffect, useMemo, useState } from "react";
import { BarChart3, Crown, MonitorPlay, RadioTower, Sparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LoginScreen } from "./components/LoginScreen";
import { PresentationMode } from "./components/PresentationMode";
import { ProgressPanel } from "./components/ProgressPanel";
import { Sidebar } from "./components/Sidebar";
import { StudentWeekWorkspace } from "./components/StudentWeekWorkspace";
import { SubmissionFeed } from "./components/SubmissionFeed";
import { WeekCard } from "./components/WeekCard";
import { useAppStore } from "./store/useAppStore";

export default function App() {
  const {
    user,
    dashboard,
    facilitatorOverview,
    activeLiveSession,
    loading,
    error,
    login,
    refreshDashboard,
    refreshFacilitatorOverview,
    refreshLiveSession,
    submitWork,
    startLiveSession,
    updateSlide,
    triggerActivity,
    toggleTopPerformer,
    resetDemoData,
    loadStoredSession,
    logout
  } = useAppStore();

  const [selectedWeekId, setSelectedWeekId] = useState(1);
  const [presentationOpen, setPresentationOpen] = useState(false);

  useEffect(() => {
    void loadStoredSession();
  }, [loadStoredSession]);

  useEffect(() => {
    if (!user) return;
    const interval = window.setInterval(() => {
      void refreshDashboard();
      void refreshLiveSession();
      if (user.role === "facilitator") {
        void refreshFacilitatorOverview();
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [refreshDashboard, refreshFacilitatorOverview, refreshLiveSession, user]);

  useEffect(() => {
    if (dashboard?.weeks?.length) {
      setSelectedWeekId((current) => {
        const exists = dashboard.weeks.some((week) => week.id === current);
        return exists ? current : dashboard.weeks[0].id;
      });
    }
  }, [dashboard]);

  const selectedWeek = dashboard?.weeks.find((week) => week.id === selectedWeekId) ?? dashboard?.weeks[0];
  const currentWeekSubmissions = useMemo(
    () => dashboard?.submissions.filter((submission) => submission.weekId === selectedWeekId) ?? [],
    [dashboard?.submissions, selectedWeekId]
  );

  if (!user) {
    return <LoginScreen onLogin={login} loading={loading} error={error} />;
  }

  if (!dashboard || !selectedWeek) {
    return <div className="flex min-h-screen items-center justify-center text-lg">Loading cohort workspace...</div>;
  }

  const pollChartData =
    facilitatorOverview?.pollAggregation.map((entry) => ({
      name: `W${entry.weekId}`,
      submissions: entry._count._all
    })) ?? [];

  const completed = dashboard.progress.byWeek.find((entry) => entry.weekId === selectedWeek.id)?.completed ?? false;
  const facilitatorActions: Array<{
    title: string;
    description: string;
    handler: () => Promise<void>;
  }> = [
    {
      title: "Trigger current activity",
      description: "Push the activity prompt to all students",
      handler: () =>
        triggerActivity(`Week ${selectedWeek.id} activity`, {
          prompt: selectedWeek.sessionBBody,
          deliverable: selectedWeek.deliverable
        })
    },
    {
      title: "Refresh live submissions",
      description: "Manually pull the latest cohort work",
      handler: refreshFacilitatorOverview
    },
    {
      title: "Open presentation",
      description: "Fullscreen session flow for teaching",
      handler: async () => setPresentationOpen(true)
    }
  ];

  return (
    <>
      <div className="grid min-h-screen gap-5 p-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:p-5">
        <Sidebar
          user={user}
          weeks={dashboard.weeks}
          selectedWeekId={selectedWeekId}
          onSelectWeek={setSelectedWeekId}
          onLogout={logout}
        />

        <main className="space-y-5">
          <header className="glass card-shadow rounded-[2rem] p-6 lg:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Cohort Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold lg:text-5xl">
                  {user.role === "facilitator" ? "Facilitator control room" : "Student learning workspace"}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
                  {user.role === "facilitator"
                    ? "Start sessions, drive the presentation flow, trigger cohort activities, and watch submissions update every 5 seconds."
                    : "Move through the active week, complete the structured work, submit outputs, and keep your cohort progress visible."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {user.role === "facilitator" ? (
                  <>
                    <button
                      onClick={() => void startLiveSession(selectedWeek.id, "A")}
                      className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
                    >
                      Start Session A
                    </button>
                    <button
                      onClick={() => void startLiveSession(selectedWeek.id, "B")}
                      className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold"
                    >
                      Start Session B
                    </button>
                    <button
                      onClick={() => void resetDemoData()}
                      className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold"
                    >
                      Reset Demo Data
                    </button>
                    <button
                      onClick={() => setPresentationOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold"
                    >
                      <MonitorPlay size={16} />
                      Live Teaching Mode
                    </button>
                  </>
                ) : (
                  <div className="rounded-full bg-[var(--accent-soft)] px-5 py-3 text-sm font-semibold text-[var(--accent)]">
                    Current week: Week {selectedWeek.id}
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <WeekCard week={selectedWeek} completed={completed} />

              {user.role === "student" ? (
                <StudentWeekWorkspace
                  week={selectedWeek}
                  userId={user.id}
                  onSubmit={async (payload) => {
                    await submitWork(payload);
                  }}
                />
              ) : (
                <section className="glass card-shadow rounded-[2rem] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">Facilitator live overview</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Present the week, trigger the activity prompt, and keep top responses visible to the cohort.
                      </p>
                    </div>
                    {activeLiveSession ? (
                      <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                        Live now: Week {activeLiveSession.weekId} Session {activeLiveSession.sessionType}
                      </div>
                    ) : (
                      <div className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
                        No active live session
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {facilitatorActions.map(({ title, description, handler }) => (
                      <button
                        key={title}
                        onClick={() => void handler()}
                        className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-5 text-left transition hover:bg-white"
                      >
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {user.role === "facilitator" ? (
                <SubmissionFeed
                  submissions={(facilitatorOverview?.recentSubmissions ?? []).filter((submission) => submission.weekId === selectedWeek.id).slice(0, 10)}
                  title="Live student responses"
                  refreshLabel="Manual refresh"
                  onRefresh={refreshFacilitatorOverview}
                />
              ) : (
                <SubmissionFeed submissions={currentWeekSubmissions} title="Your submissions" onRefresh={refreshDashboard} />
              )}
            </div>

            <div className="space-y-5">
              {user.role === "student" ? (
                <ProgressPanel
                  percent={dashboard.progress.percent}
                  completedWeeks={dashboard.progress.completedWeeks}
                  totalWeeks={dashboard.progress.totalWeeks}
                />
              ) : (
                <section className="glass card-shadow rounded-[2rem] p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                    <BarChart3 size={16} />
                    Submission Volume
                  </div>
                  <div className="mt-5 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pollChartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(17,34,29,0.08)" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="submissions" radius={[12, 12, 0, 0]} fill="#0f766e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              )}

              <section className="glass card-shadow rounded-[2rem] p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                  <RadioTower size={16} />
                  Active Classroom Signal
                </div>
                <div className="mt-4 rounded-[1.5rem] bg-white/80 p-5">
                  {activeLiveSession ? (
                    <>
                      <p className="text-sm font-semibold">
                        Week {activeLiveSession.weekId} • Session {activeLiveSession.sessionType}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{activeLiveSession.week.title}</p>
                      <p className="mt-3 rounded-2xl bg-[var(--accent-soft)] p-3 text-sm text-[var(--ink)]">
                        {activeLiveSession.activityTitle
                          ? `${activeLiveSession.activityTitle}: ${String(activeLiveSession.activityBody?.prompt ?? "")}`
                          : "No triggered activity yet. Students will see session status update when the facilitator pushes one."}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      No live session is active yet. Start one from the facilitator dashboard to sync the cohort.
                    </p>
                  )}
                </div>
              </section>

              {user.role === "facilitator" ? (
                <section className="glass card-shadow rounded-[2rem] p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                    <Crown size={16} />
                    Top performers
                  </div>
                  <div className="mt-4 space-y-3">
                    {facilitatorOverview?.topPerformers.map((student, index) => (
                      <article key={student.id} className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">
                              #{index + 1} {student.name}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              Avg score {student.avgScore} • {student.submissions} submissions
                            </p>
                          </div>
                          <button
                            onClick={() => void toggleTopPerformer(student.id, !student.topPerformer)}
                            className={`rounded-full px-3 py-2 text-xs font-semibold ${
                              student.topPerformer
                                ? "bg-amber-100 text-amber-700"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {student.topPerformer ? "Flagged" : "Mark top performer"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="glass card-shadow rounded-[2rem] p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                    <Sparkles size={16} />
                    This Week Focus
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    Session A: {selectedWeek.sessionATheme}. Session B: {selectedWeek.sessionBTheme}. Use the workspace
                    below the week card to complete the required deliverable and keep your cohort progress moving.
                  </p>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>

      {presentationOpen && activeLiveSession && selectedWeek.id === activeLiveSession.weekId ? (
        <PresentationMode
          liveSession={activeLiveSession}
          week={selectedWeek}
          onClose={() => setPresentationOpen(false)}
          onNext={() => updateSlide(activeLiveSession.presentationIdx + 1)}
          onPrevious={() => updateSlide(Math.max(activeLiveSession.presentationIdx - 1, 0))}
          onTrigger={() =>
            triggerActivity(`Week ${selectedWeek.id} activity`, {
              prompt: selectedWeek.sessionBBody,
              deliverable: selectedWeek.deliverable
            })
          }
        />
      ) : null}
    </>
  );
}
