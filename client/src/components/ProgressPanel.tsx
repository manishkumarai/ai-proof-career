import { BarChart3, CheckCircle2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type ProgressPanelProps = {
  percent: number;
  completedWeeks: number;
  totalWeeks: number;
};

export function ProgressPanel({ percent, completedWeeks, totalWeeks }: ProgressPanelProps) {
  const chartData = [
    { name: "Completed", value: completedWeeks, color: "#0f766e" },
    { name: "Remaining", value: Math.max(totalWeeks - completedWeeks, 0), color: "#eadfce" }
  ];

  return (
    <section className="glass card-shadow rounded-[2rem] p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
        <BarChart3 size={16} />
        Progress Tracker
      </div>
      <div className="mt-5 flex items-center gap-4">
        <div className="h-40 w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie innerRadius={44} outerRadius={62} data={chartData} dataKey="value" stroke="none">
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-5xl font-semibold">{percent}%</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {completedWeeks} of {totalWeeks} weeks completed
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircle2 size={14} />
            On track with the cohort roadmap
          </div>
        </div>
      </div>
    </section>
  );
}
