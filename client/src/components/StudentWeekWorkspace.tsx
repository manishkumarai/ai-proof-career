import { useMemo, useState } from "react";
import { ExternalLink, FileDown, Save } from "lucide-react";
import type { Week } from "../lib/types";

type StudentWeekWorkspaceProps = {
  week: Week;
  userId: string;
  onSubmit: (payload: {
    userId: string;
    weekId: number;
    type: string;
    content: Record<string, unknown>;
    score?: number;
  }) => Promise<void>;
};

function estimateScore(payload: Record<string, unknown>) {
  let truthyCount = 0;
  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) {
      truthyCount += value.filter(Boolean).length;
    } else if (value) {
      truthyCount += 1;
    }
  }

  return Math.min(100, 50 + truthyCount * 5);
}

export function StudentWeekWorkspace({ week, userId, onSubmit }: StudentWeekWorkspaceProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [w1, setW1] = useState({
    targetIndustry: "Banking",
    roleOne: "Data Analyst",
    roleTwo: "AI Product Analyst",
    threatLevel: "Medium",
    currentSkillScore: 3,
    marketDemandScore: 4
  });
  const [w2, setW2] = useState({
    useCaseTitle: "",
    businessProblem: "",
    toolStack: "",
    humanOwner: "",
    salaryEstimate: ""
  });
  const [w3, setW3] = useState({
    analytics: 4,
    communication: 3,
    processThinking: 3,
    domainStrength: 4,
    branch: "ECE",
    targetIndustry: "Telecom"
  });
  const [w4, setW4] = useState({
    role: "Data Analyst",
    toolRequirements: "",
    startupSalary: "",
    mncSalary: "",
    transitionDifficulty: 3,
    fastestPath: ""
  });
  const [w5, setW5] = useState({
    skillA: "SQL",
    currentA: 2,
    requiredA: 4,
    skillB: "Power BI",
    currentB: 2,
    requiredB: 4,
    skillC: "Python",
    currentC: 1,
    requiredC: 4
  });
  const [w6, setW6] = useState({
    title: "",
    dataset: "",
    tools: "",
    problemFraming: "",
    githubUrl: ""
  });
  const [w7, setW7] = useState({
    experimentType: "Real Application",
    applications: "3",
    outreachLogs: "",
    interviewNotes: "",
    debrief: ""
  });
  const [w8, setW8] = useState({
    phase1: "",
    phase2: "",
    phase3: "",
    milestones: "",
    outreachTarget: "10"
  });

  const archetype = useMemo(() => {
    const scores = [
      { label: "Data Analyst", value: w3.analytics + w3.communication },
      { label: "BPA Analyst", value: w3.processThinking + w3.communication },
      { label: "AI Product Analyst", value: w3.communication + w3.analytics },
      { label: "Domain + Data Hybrid", value: w3.domainStrength + w3.analytics }
    ].sort((a, b) => b.value - a.value);
    return scores[0]?.label ?? "Data Analyst";
  }, [w3]);

  const identityStatement = `I am a ${w3.branch} engineer with strong analytics and domain grounding. I am building toward the ${archetype} role in the ${w3.targetIndustry} sector because the industry AI use cases align with my strengths. My 3-month milestone is to ship one portfolio project and become interview-ready for entry roles.`;

  const skillPriorities = useMemo(() => {
    const skills = [
      { skill: w5.skillA, gap: w5.requiredA - w5.currentA },
      { skill: w5.skillB, gap: w5.requiredB - w5.currentB },
      { skill: w5.skillC, gap: w5.requiredC - w5.currentC }
    ];
    return skills.sort((a, b) => b.gap - a.gap);
  }, [w5]);

  const saveSubmission = async (type: string, content: Record<string, unknown>) => {
    setStatus("Saving submission...");
    await onSubmit({
      userId,
      weekId: week.id,
      type,
      content,
      score: estimateScore(content)
    });
    setStatus("Saved to cohort workspace.");
    window.setTimeout(() => setStatus(null), 2400);
  };

  const exportPlanPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("90-Day Career Action Plan", 14, 20);
    pdf.setFontSize(11);
    [
      `Phase 1: ${w8.phase1}`,
      `Phase 2: ${w8.phase2}`,
      `Phase 3: ${w8.phase3}`,
      `Milestones: ${w8.milestones}`,
      `Weekly outreach target: ${w8.outreachTarget}`
    ].forEach((line, index) => pdf.text(line, 14, 38 + index * 10, { maxWidth: 180 }));
    pdf.save("ai-career-90-day-plan.pdf");
  };

  const SectionShell = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="glass rounded-[2rem] p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className={`w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none focus:border-[var(--accent)] ${props.className ?? ""}`}
    />
  );

  const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
      {...props}
      className={`min-h-28 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none focus:border-[var(--accent)] ${props.className ?? ""}`}
    />
  );

  if (week.id === 1) {
    const viabilityScore = w1.marketDemandScore * (6 - w1.currentSkillScore);
    return (
      <SectionShell title="Week 1 Workspace: Automation Risk Matrix + Industry Decision Matrix">
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={w1.targetIndustry} onChange={(event) => setW1({ ...w1, targetIndustry: event.target.value })} placeholder="Target industry" />
          <Input value={w1.roleOne} onChange={(event) => setW1({ ...w1, roleOne: event.target.value })} placeholder="Role 1" />
          <Input value={w1.roleTwo} onChange={(event) => setW1({ ...w1, roleTwo: event.target.value })} placeholder="Role 2" />
          <Input value={w1.threatLevel} onChange={(event) => setW1({ ...w1, threatLevel: event.target.value })} placeholder="Automation threat" />
          <Input type="number" min={1} max={5} value={w1.currentSkillScore} onChange={(event) => setW1({ ...w1, currentSkillScore: Number(event.target.value) })} placeholder="Current skill score" />
          <Input type="number" min={1} max={5} value={w1.marketDemandScore} onChange={(event) => setW1({ ...w1, marketDemandScore: Number(event.target.value) })} placeholder="Market demand score" />
        </div>
        <div className="rounded-2xl bg-[var(--accent-soft)] p-4 text-sm">
          Viability score: <span className="font-semibold">{viabilityScore}</span> using market demand × inverse skills gap.
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => void saveSubmission("automation-risk-matrix", { ...w1, viabilityScore })}
        >
          <Save size={16} />
          Save Week 1
        </button>
        {status ? <p className="text-sm text-[var(--accent)]">{status}</p> : null}
      </SectionShell>
    );
  }

  if (week.id === 2) {
    return (
      <SectionShell title="Week 2 Workspace: AI Use Case Builder">
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={w2.useCaseTitle} onChange={(event) => setW2({ ...w2, useCaseTitle: event.target.value })} placeholder="Use case title" />
          <Input value={w2.toolStack} onChange={(event) => setW2({ ...w2, toolStack: event.target.value })} placeholder="Tool stack" />
          <Textarea value={w2.businessProblem} onChange={(event) => setW2({ ...w2, businessProblem: event.target.value })} placeholder="Business problem it solves" className="md:col-span-2" />
          <Input value={w2.humanOwner} onChange={(event) => setW2({ ...w2, humanOwner: event.target.value })} placeholder="Human role that owns the output" />
          <Input value={w2.salaryEstimate} onChange={(event) => setW2({ ...w2, salaryEstimate: event.target.value })} placeholder="Approximate salary estimate" />
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={String(week.activities.labLink ?? "https://colab.research.google.com/")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold"
          >
            <ExternalLink size={16} />
            Launch Google Colab
          </a>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
            onClick={() => void saveSubmission("industry-ai-map", w2)}
          >
            <Save size={16} />
            Save Week 2
          </button>
        </div>
        {status ? <p className="text-sm text-[var(--accent)]">{status}</p> : null}
      </SectionShell>
    );
  }

  if (week.id === 3) {
    return (
      <SectionShell title="Week 3 Workspace: Role Archetype Quiz + Identity Statement">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {([
            ["Analytics", "analytics"],
            ["Communication", "communication"],
            ["Process Thinking", "processThinking"],
            ["Domain Strength", "domainStrength"]
          ] as const).map(([label, key]) => (
            <label key={key} className="rounded-2xl border border-[var(--line)] bg-white/80 p-4">
              <div className="text-sm font-semibold">{label}</div>
              <Input
                type="number"
                min={1}
                max={5}
                value={w3[key]}
                onChange={(event) => setW3({ ...w3, [key]: Number(event.target.value) })}
                className="mt-3"
              />
            </label>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={w3.branch} onChange={(event) => setW3({ ...w3, branch: event.target.value })} placeholder="Branch" />
          <Input value={w3.targetIndustry} onChange={(event) => setW3({ ...w3, targetIndustry: event.target.value })} placeholder="Target industry" />
        </div>
        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-sm font-semibold">Primary archetype recommendation: {archetype}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{identityStatement}</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => void saveSubmission("role-archetype-quiz", { ...w3, archetype, identityStatement })}
        >
          <Save size={16} />
          Save Week 3
        </button>
        {status ? <p className="text-sm text-[var(--accent)]">{status}</p> : null}
      </SectionShell>
    );
  }

  if (week.id === 4) {
    return (
      <SectionShell title="Week 4 Workspace: Opportunity Map Builder">
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={w4.role} onChange={(event) => setW4({ ...w4, role: event.target.value })} placeholder="Target role" />
          <Input value={String(w4.transitionDifficulty)} onChange={(event) => setW4({ ...w4, transitionDifficulty: Number(event.target.value) })} placeholder="Transition difficulty (1-5)" />
          <Textarea value={w4.toolRequirements} onChange={(event) => setW4({ ...w4, toolRequirements: event.target.value })} placeholder="Exact tool requirements from JD research" className="md:col-span-2" />
          <Input value={w4.startupSalary} onChange={(event) => setW4({ ...w4, startupSalary: event.target.value })} placeholder="Startup salary range" />
          <Input value={w4.mncSalary} onChange={(event) => setW4({ ...w4, mncSalary: event.target.value })} placeholder="MNC / GCC salary range" />
          <Textarea value={w4.fastestPath} onChange={(event) => setW4({ ...w4, fastestPath: event.target.value })} placeholder="Fastest path from current state to interview-ready" className="md:col-span-2" />
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => void saveSubmission("opportunity-map-builder", w4)}
        >
          <Save size={16} />
          Save Week 4
        </button>
        {status ? <p className="text-sm text-[var(--accent)]">{status}</p> : null}
      </SectionShell>
    );
  }

  if (week.id === 5) {
    return (
      <SectionShell title="Week 5 Workspace: Skill Gap Matrix">
        <div className="overflow-hidden rounded-[1.5rem] border border-[var(--line)]">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-stone-100 text-left">
              <tr>
                <th className="px-4 py-3">Skill</th>
                <th className="px-4 py-3">Current</th>
                <th className="px-4 py-3">Required</th>
                <th className="px-4 py-3">Gap</th>
              </tr>
            </thead>
            <tbody>
              {([
                ["skillA", "currentA", "requiredA"],
                ["skillB", "currentB", "requiredB"],
                ["skillC", "currentC", "requiredC"]
              ] as const).map(([skillKey, currentKey, requiredKey]) => (
                <tr key={skillKey} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3">
                    <Input value={String(w5[skillKey])} onChange={(event) => setW5({ ...w5, [skillKey]: event.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <Input type="number" min={1} max={5} value={Number(w5[currentKey])} onChange={(event) => setW5({ ...w5, [currentKey]: Number(event.target.value) })} />
                  </td>
                  <td className="px-4 py-3">
                    <Input type="number" min={1} max={5} value={Number(w5[requiredKey])} onChange={(event) => setW5({ ...w5, [requiredKey]: Number(event.target.value) })} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--accent)]">{Number(w5[requiredKey]) - Number(w5[currentKey])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl bg-[var(--accent-soft)] p-4 text-sm">
          Top priorities: {skillPriorities.map((item) => `${item.skill} (${item.gap})`).join(", ")}
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => void saveSubmission("skill-gap-matrix", { ...w5, priorities: skillPriorities })}
        >
          <Save size={16} />
          Save Week 5
        </button>
        {status ? <p className="text-sm text-[var(--accent)]">{status}</p> : null}
      </SectionShell>
    );
  }

  if (week.id === 6) {
    const readme = `# ${w6.title || "Industry Project"}\n\n## Business Context\n${w6.problemFraming}\n\n## Dataset\n${w6.dataset}\n\n## Tools\n${w6.tools}\n\n## What this means for the business\nThis project helps translate technical output into action for enterprise stakeholders.`;
    return (
      <SectionShell title="Week 6 Workspace: Project Builder">
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={w6.title} onChange={(event) => setW6({ ...w6, title: event.target.value })} placeholder="Project title" />
          <Input value={w6.dataset} onChange={(event) => setW6({ ...w6, dataset: event.target.value })} placeholder="Dataset" />
          <Input value={w6.tools} onChange={(event) => setW6({ ...w6, tools: event.target.value })} placeholder="Tools" className="md:col-span-2" />
          <Textarea value={w6.problemFraming} onChange={(event) => setW6({ ...w6, problemFraming: event.target.value })} placeholder="Business framing" className="md:col-span-2" />
          <Input value={w6.githubUrl} onChange={(event) => setW6({ ...w6, githubUrl: event.target.value })} placeholder="GitHub repository link" className="md:col-span-2" />
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/80 p-4">
          <p className="text-sm font-semibold">README generator preview</p>
          <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs leading-6 text-[var(--muted)]">{readme}</pre>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => void saveSubmission("project-builder", { ...w6, readme })}
        >
          <Save size={16} />
          Save Week 6
        </button>
        {status ? <p className="text-sm text-[var(--accent)]">{status}</p> : null}
      </SectionShell>
    );
  }

  if (week.id === 7) {
    return (
      <SectionShell title="Week 7 Workspace: Career Experiment Tracker">
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={w7.experimentType} onChange={(event) => setW7({ ...w7, experimentType: event.target.value })} placeholder="Experiment type" />
          <Input value={w7.applications} onChange={(event) => setW7({ ...w7, applications: event.target.value })} placeholder="Applications completed" />
          <Textarea value={w7.outreachLogs} onChange={(event) => setW7({ ...w7, outreachLogs: event.target.value })} placeholder="Outreach log" className="md:col-span-2" />
          <Textarea value={w7.interviewNotes} onChange={(event) => setW7({ ...w7, interviewNotes: event.target.value })} placeholder="Interview or recruiter notes" className="md:col-span-2" />
          <Textarea value={w7.debrief} onChange={(event) => setW7({ ...w7, debrief: event.target.value })} placeholder="Written debrief" className="md:col-span-2" />
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => void saveSubmission("career-experiment-tracker", w7)}
        >
          <Save size={16} />
          Save Week 7
        </button>
        {status ? <p className="text-sm text-[var(--accent)]">{status}</p> : null}
      </SectionShell>
    );
  }

  return (
    <SectionShell title="Week 8 Workspace: 90-Day Plan Builder">
      <Textarea value={w8.phase1} onChange={(event) => setW8({ ...w8, phase1: event.target.value })} placeholder="Phase 1: Days 1-30" />
      <Textarea value={w8.phase2} onChange={(event) => setW8({ ...w8, phase2: event.target.value })} placeholder="Phase 2: Days 31-60" />
      <Textarea value={w8.phase3} onChange={(event) => setW8({ ...w8, phase3: event.target.value })} placeholder="Phase 3: Days 61-90" />
      <Textarea value={w8.milestones} onChange={(event) => setW8({ ...w8, milestones: event.target.value })} placeholder="Milestones and dependencies" />
      <Input value={w8.outreachTarget} onChange={(event) => setW8({ ...w8, outreachTarget: event.target.value })} placeholder="Weekly outreach target" />
      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => void saveSubmission("ninety-day-plan", w8)}
        >
          <Save size={16} />
          Save Week 8
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold"
          onClick={() => void exportPlanPdf()}
        >
          <FileDown size={16} />
          Export PDF
        </button>
      </div>
      {status ? <p className="text-sm text-[var(--accent)]">{status}</p> : null}
    </SectionShell>
  );
}
