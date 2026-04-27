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
    activeLiveSession,
    loading,
    error,
    login,
    refreshDashboard,
    submitWork,
    startLiveSession,
    updateSlide,
    triggerActivity,
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
    return <div className="flex min-h-screen items-center justify-center text-lg">Loading workspace...</div>;
  }

  const pollChartData =
    dashboard?.submissions
      ?.reduce(
        (acc, submission) => {
          const entry = acc.find((e) => e.weekId === submission.weekId);
          if (entry) {
            entry.count++;
          } else {
            acc.push({ weekId: submission.weekId, count: 1 });
          }
          return acc;
        },
        [] as { weekId: number; count: number }[]
      )
      ?.map((entry) => ({
        name: `W${entry.weekId}`,
        submissions: entry.count
      })) ?? [];

  const completedWeeks = useMemo(() => {
    const completed = new Set<number>();
    dashboard?.weeks.forEach((week) => {
      const hasSubmission = dashboard.submissions.some(
        (s) => s.userId === user.id && s.weekId === week.id && s.type === "primary"
      );
      if (hasSubmission) completed.add(week.id);
    });
    return completed;
  }, [dashboard, user.id]);

  const renderTabContent = () => {
    if (selectedWeek.id === 8 && user.role === "student") {
      return (
        <StudentWeekWorkspace
          userId={user.id}
          week={selectedWeek}
          
          onSubmit={async (payload) => void submitWork(payload)}
        />
      );
    }

    return (
      <div className="space-y-5">
        <StudentWeekWorkspace
          userId={user.id}
          week={selectedWeek}
          
          onSubmit={async (payload) => void submitWork(payload)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#E8F4F0,#E8F4F0)] text-[var(--ink)] transition-colors">
      <Sidebar user={user} weeks={dashboard?.weeks ?? []} selectedWeekId={selectedWeekId} onSelectWeek={setSelectedWeekId} onLogout={logout} />

      <main className="pl-0 sm:pl-80">
        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-8">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">AI-Proof Career OS</p>
              <h1 className="mt-3 text-3xl font-semibold lg:text-5xl">
                {user.role === "facilitator" ? "Facilitator Demo Mode (Local Only)" : "Student Learning Workspace"}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
                {user.role === "facilitator"
                  ? "Practice presenting with demo data on YOUR device. Use screen-sharing with students for live teaching."
                  : "Move through the active week, complete the structured work, submit outputs, and track your progress."}
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

          {error ? (
            <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {/* Week Card */}
          <WeekCard week={selectedWeek} completed={completedWeeks.has(selectedWeek.id)} />

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Submissions */}
            {user.role === "facilitator" ? (
              <div className="space-y-4 rounded-2xl bg-white/40 p-6 backdrop-blur lg:col-span-2">
                <p className="text-sm font-semibold text-[var(--muted)]">Submissions Feed</p>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  Live submissions feed requires backend access. On GitHub Pages, this demo tracks only sessions started on YOUR device. Use screen-sharing to view student work during the cohort.
                </p>
              </div>
            ) : (
              <SubmissionFeed submissions={currentWeekSubmissions} title="Your submissions" onRefresh={refreshDashboard} />
            )}

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
                    Local Session Data
                  </div>
                  <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
                    Cohort analytics not available. This demo tracks only sessions on YOUR device. For organization-wide insights, deploy a backend.
                  </p>
                  <div className="mt-4 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pollChartData.length > 0 ? pollChartData : [{ name: "W1", submissions: 0 }]}>
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
                  {user.role === "facilitator" ? "Local Session Signal" : "Active Classroom Signal"}
                </div>
                <div className="mt-4 rounded-[1.5rem] bg-white/80 p-5">
                  {activeLiveSession && activeLiveSession.isActive ? (
                    <>
                      <p className="text-sm font-semibold">
                        Week {activeLiveSession.weekId} • Session {activeLiveSession.sessionType}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{activeLiveSession.week.title}</p>
                      {user.role === "facilitator" && (
                        <p className="mt-2 text-xs text-[var(--accent)]">Session active only on this device</p>
                      )}
                      <p className="mt-3 rounded-2xl bg-[var(--accent-soft)] p-3 text-sm text-[var(--ink)]">
                        {activeLiveSession.activityTitle
                          ? `${activeLiveSession.activityTitle}: ${String(activeLiveSession.activityBody?.prompt ?? "")}`
                          : user.role === "facilitator"
                            ? "No triggered activity yet. Demo mode only—use screen-sharing to share with students."
                            : "No triggered activity yet. Students will see session status update when the facilitator pushes one."}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      {user.role === "facilitator"
                        ? "No session active. Start one from above to practice presenting."
                        : "No live session is active yet."}
                    </p>
                  )}
                </div>
              </section>

              {user.role === "student" ? (
                <section className="glass card-shadow rounded-[2rem] p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                    <Sparkles size={16} />
                    This Week Focus
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    Session A: {selectedWeek.sessionATheme}. Session B: {selectedWeek.sessionBTheme}. Use the workspace
                    below the week card to complete the required deliverable and track your progress.
                  </p>
                </section>
              ) : null}
            </div>
          </div>

          {/* Workspace */}
          {renderTabContent()}
        </div>
      </main>

      {presentationOpen && activeLiveSession && activeLiveSession.isActive && selectedWeek.id === activeLiveSession.weekId ? (
        <PresentationMode
          session={activeLiveSession}
          onClose={() => setPresentationOpen(false)}
          onUpdateSlide={updateSlide}
          onTriggerActivity={triggerActivity}
        />
      ) : null}
    </div>
  );
}
