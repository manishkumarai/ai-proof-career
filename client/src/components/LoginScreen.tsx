import { useState } from "react";
import type { Role } from "../lib/types";

type LoginScreenProps = {
  onLogin: (name: string, role: Role) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export function LoginScreen({ onLogin, loading, error }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("student");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="glass card-shadow rounded-[2rem] border border-white/60 p-8 lg:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">AI-Proof Career OS</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight lg:text-6xl">
            A live cohort platform for facilitators and students to run the 8-week transformation journey.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            This local prototype turns the curriculum into a real operating system: live teaching mode, weekly
            labs, structured worksheets, polling-based activity sync, and submission tracking across all 8 weeks.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              "8 curriculum-driven weeks",
              "Facilitator presentation mode",
              "Student tools and progress tracking"
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-[var(--line)] bg-white/70 p-4">
                <p className="text-sm font-medium text-[var(--ink)]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass card-shadow rounded-[2rem] p-8 lg:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--rose)]">Local Login</p>
          <h2 className="mt-3 text-3xl font-semibold">Enter the cohort</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Choose a role and name. No external auth is required; the session is stored locally for this browser
            session.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!name.trim()) return;
              await onLogin(name.trim(), role);
            }}
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Your name</span>
              <input
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--accent)]"
                placeholder="Enter your display name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium">Choose role</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {([
                  ["student", "Student", "Complete labs, submit worksheets, track progress"],
                  ["facilitator", "Facilitator", "Run sessions, trigger activities, monitor cohort"]
                ] as const).map(([value, label, description]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      role === value
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--line)] bg-white/70"
                    }`}
                  >
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="mt-1 text-sm text-[var(--muted)]">{description}</div>
                  </button>
                ))}
              </div>
            </div>

            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <button
              className="w-full rounded-2xl bg-[var(--ink)] px-5 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              disabled={loading || name.trim().length < 2}
            >
              {loading ? "Entering cohort..." : `Continue as ${role}`}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
