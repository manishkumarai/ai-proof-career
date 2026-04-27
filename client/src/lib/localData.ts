import type { DashboardPayload, FacilitatorOverview, LiveSession, Role, Submission, User, Week } from "./types";

const dbKey = "ai-proof-career1-db";

export const curriculumWeeks: Week[] = [
  {
    id: 1,
    slug: "discover",
    title: "DISCOVER - Industry Landscape, Role Architecture & Automation Risk Analysis",
    theme: "Map how AI is changing jobs across target industries and identify viable role pathways.",
    sessionATheme: "How AI is restructuring org charts in 6 industries with evidence from real enterprise deployments",
    sessionABody: [
      "Coach presents the Automation Risk Matrix at role-level granularity rather than generic automation commentary.",
      "Examples show roles being eliminated such as manual data entry, routine report generation, and claims adjudication.",
      "Examples also show roles being redefined such as analyst roles that now require Python and SQL, plus new roles like MLOps, AI Product Analyst, and BPA Consultant.",
      "Industries referenced in the document: Banking, Insurance, Telecom, Retail, Real Estate, and Mortgage."
    ],
    sessionBTheme: "Student Automation Risk Analysis - hands-on exercise",
    sessionBBody:
      "Students fill a pre-built Automation Risk Matrix with current proficiency, target-industry relevance, and automation threat level for each role, then the coach reviews live outputs and common gaps.",
    deliverable: "Industry Choice Decision Matrix with 2 target industries and 3 target roles ranked by viability score.",
    asyncContent:
      "Video 1 on a 2025 bank org chart reshaped by AI, Video 2 on WEF Future of Jobs 2025, and the Branch Reality Check worksheet.",
    toolsUsed: ["Excel", "Naukri.com", "WhatsApp", "Automation Risk Matrix"],
    activities: {
      primaryTool: "automation-risk-matrix",
      secondaryTool: "industry-decision-matrix",
      worksheetPrompt: "Use job demand, skills-fit, and automation threat to choose the strongest near-term direction."
    }
  },
  {
    id: 2,
    slug: "orient",
    title: "ORIENT - How AI Actually Works in Your Target Industry",
    theme: "Demystify industry AI work through practical tool walkthroughs and guided execution.",
    sessionATheme: "Live technical walk-through of AI use cases from 4 industries shown with actual code and tools",
    sessionABody: [
      "Banking demo: UCI Credit Risk dataset in Google Colab using Pandas and scikit-learn to build a logistic regression classifier and interpret the confusion matrix.",
      "Insurance demo: prompt-based claims categorisation using sample anonymised claims and ChatGPT.",
      "Telecom demo: churn prediction output in a pre-built Power BI file segmented by customer cohort.",
      "Retail demo: Excel-based moving average demand forecasting for procurement planning."
    ],
    sessionBTheme: "Run the Banking Colab notebook live with guided execution",
    sessionBBody:
      "Students execute the notebook step-by-step from data load through interpretation, while the coach debugs issues live.",
    deliverable:
      "My Industry AI Map capturing 3 use cases, the business problem, tools used, owning human role, and salary estimate.",
    asyncContent:
      "15-minute banking credit scoring walkthrough, linked Colab notebook, and AI Use Case Research worksheet.",
    toolsUsed: ["Google Colab", "Python", "Power BI", "Excel", "ChatGPT"],
    activities: {
      primaryTool: "ai-use-case-builder",
      labLink: "https://colab.research.google.com/",
      worksheetPrompt: "Document the problem, AI technique, business owner, and observed career relevance for each use case."
    }
  },
  {
    id: 3,
    slug: "clarify",
    title: "CLARIFY - The 5 Role Archetypes in AI-Transformed Organisations",
    theme: "Help students identify the best-fit AI-era role archetype and articulate a clear identity statement.",
    sessionATheme: "The 5 AI-era role archetypes with real JDs, salary data, and transition paths",
    sessionABody: [
      "Data Analyst (AI-augmented): SQL, Python, Power BI or Tableau, with salaries and day-to-day expectations.",
      "BPA Analyst: Power Automate or UiPath basics, process mapping, and enterprise automation contexts.",
      "AI Product Analyst: requirements documentation, prompt engineering, stakeholder management, and SQL.",
      "Domain plus Data Hybrid Specialist: branch-specific technical context combined with analytics tooling.",
      "AI Solutions Consultant: communication, architecture thinking, domain knowledge, and advisory work."
    ],
    sessionBTheme: "Self-Assessment to Role Archetype Mapping",
    sessionBBody:
      "Students answer a structured worksheet across four skill clusters, map to a primary and secondary archetype, and share results in pods for feedback.",
    deliverable:
      "Career Identity Statement and Role Archetype Card with branch, strengths, role, industry, and 3-month milestone.",
    asyncContent:
      "No explicit async block in the source section, so the app surfaces the role card and peer feedback as the follow-through artifact.",
    toolsUsed: ["Structured worksheet", "WhatsApp accountability pod"],
    activities: {
      primaryTool: "role-archetype-quiz",
      outputTool: "career-identity-generator"
    }
  },
  {
    id: 4,
    slug: "map",
    title: "MAP - Personal AI Opportunity Map with Real Salary & Market Data",
    theme: "Translate role clarity into an opportunity map grounded in live job market signals.",
    sessionATheme: "How hiring actually works inside enterprises and what this means for your job search strategy",
    sessionABody: [
      "Explains ATS screening, project relevance, and why fresher portfolios can outperform stronger college brands at the 4-8 LPA level.",
      "Compares hiring patterns for GCCs, FinTech startups, PSU banks, IT services firms, and enterprise teams.",
      "Connects enterprise hiring logic to realistic entry paths for Tier 2 and Tier 3 graduates."
    ],
    sessionBTheme: "Build the Personal AI Opportunity Map",
    sessionBBody:
      "Students fill a Notion-style template for 3 target roles with tool requirements, salary range by company type, transition difficulty, and fastest path to interview-readiness.",
    deliverable:
      "Personal AI Opportunity Map: 3 roles x 5 data fields, formatted as a visual artifact students can share.",
    asyncContent:
      "10-minute video on the 3 company types hiring Tier 2 and Tier 3 engineers plus a salary benchmarking worksheet.",
    toolsUsed: ["LinkedIn Jobs", "Notion", "Canva", "JD research"],
    activities: {
      primaryTool: "opportunity-map-builder",
      secondaryTool: "job-analysis-fields"
    }
  },
  {
    id: 5,
    slug: "build",
    title: "BUILD - Your 3-Layer Technical Skill Stack",
    theme: "Turn target roles into a concrete, prioritized skill-building sprint.",
    sessionATheme: "The 3-Layer Skill Stack built per branch, per archetype, and per target industry",
    sessionABody: [
      "Layer 1 - Domain Core: branch-specific foundations such as SQL, Python basics, Excel, statistics, and technical branch tools.",
      "Layer 2 - AI Co-Pilot Tools: Power BI, Pandas, SQL, GitHub, Power Automate, UiPath, prompt engineering, and branch-specific data tooling.",
      "Layer 3 - Human Differentiator: requirements documentation, solution presentation, and business case framing."
    ],
    sessionBTheme: "Skill Gap Matrix Completion plus 60-Day Sprint Design",
    sessionBBody:
      "Students assess current and required proficiency, compute gap scores, prioritize top skills by gap and role criticality, and convert the result into an 8-week sprint sequence.",
    deliverable:
      "Personalised 60-Day Skill Sprint Plan with one priority skill, weekly targets, capstone definition, and hours commitment.",
    asyncContent:
      "Pre-researched resources include SQL tutorials, CS50P, Kaggle Python, Microsoft Learn Power BI and Power Automate, AZ-900 resources, and the Google Data Analytics Certificate.",
    toolsUsed: ["Excel", "Notion", "Microsoft Learn", "Kaggle", "Coursera"],
    activities: {
      primaryTool: "skill-gap-matrix",
      secondaryTool: "priority-skill-planner"
    }
  },
  {
    id: 6,
    slug: "execute",
    title: "EXECUTE - Build 1 Industry-Specific Technical Portfolio Project",
    theme: "Help students create a credible portfolio project with business framing and GitHub proof.",
    sessionATheme: "What makes a portfolio project credible to an enterprise hiring manager",
    sessionABody: [
      "Contrasts tutorial-clone projects with industry-framed portfolio work that includes business recommendations.",
      "Explains how to structure a README around business story and why GitHub completeness matters.",
      "Presents branch-specific project briefs for Data Analyst, BPA Analyst, and Domain plus Data Hybrid paths."
    ],
    sessionBTheme: "Project Sprint Session",
    sessionBBody:
      "Students choose a dataset or workflow, create a GitHub repo, begin project setup, run initial EDA or workflow mapping, and aim to push a first commit before session end.",
    deliverable:
      "1 live portfolio project on GitHub with clean code, README, visualisations, and a business interpretation section.",
    asyncContent:
      "10-minute GitHub portfolio evaluation video and a 10-point project quality checklist for self-scoring.",
    toolsUsed: ["GitHub", "Python", "Power BI", "Power Automate", "Excel"],
    activities: {
      primaryTool: "project-builder",
      secondaryTool: "github-submission"
    }
  },
  {
    id: 7,
    slug: "practice",
    title: "PRACTICE - Real-World Career Experiments with Enterprise Hiring Context",
    theme: "Move from preparation into guided real-world job search experiments.",
    sessionATheme: "How to get your first break without campus placement using off-campus channels that actually work",
    sessionABody: [
      "Covers LinkedIn outreach, referral activation, hackathons and Kaggle, ATS-friendly Naukri strategy, and off-campus drive discovery.",
      "Anchors the advice in real hiring behaviour for Tier 2 and Tier 3 graduates."
    ],
    sessionBTheme: "Choose one Career Experiment",
    sessionBBody:
      "Students complete one option: apply to 3 roles, join a Kaggle challenge and publish their approach, or conduct an informational interview and write a debrief.",
    deliverable:
      "1 completed career experiment plus written debrief and, if relevant, a rejection reframe plan.",
    asyncContent:
      "No separate async block is listed, so the app treats experiment follow-through and debrief capture as the between-session work.",
    toolsUsed: ["LinkedIn", "Naukri.com", "GitHub", "Medium", "WhatsApp"],
    activities: {
      primaryTool: "career-experiment-tracker",
      secondaryTool: "interview-notes"
    }
  },
  {
    id: 8,
    slug: "integrate",
    title: "INTEGRATE - 90-Day Technical Career Action Plan & Graduation",
    theme: "Consolidate the program into a milestone-based 90-day career plan and graduation workflow.",
    sessionATheme: "Building a concrete 90-day plan with milestones and dependencies",
    sessionABody: [
      "Phase 1 focuses on one certification, LinkedIn updates, and two technical posts per week.",
      "Phase 2 adds a second project, 20 targeted applications, and 5 informational interviews.",
      "Phase 3 drives weekly recruiter outreach, follow-ups, and off-campus applications."
    ],
    sessionBTheme: "Post-Assessment plus Graduation",
    sessionBBody:
      "Students complete post-program assessment, review pre/post growth, celebrate progress, and submit their final 90-day plan and graduation artifacts.",
    deliverable:
      "Signed 90-Day Career Action Plan exported as PDF, plus testimonial, score data, and NPS survey collection.",
    asyncContent:
      "Alumni onboarding includes a monthly alumni call, job-search support, and L2 program visibility.",
    toolsUsed: ["Notion", "PDF export", "LinkedIn", "WhatsApp"],
    activities: {
      primaryTool: "ninety-day-plan-builder",
      secondaryTool: "pdf-export"
    }
  }
];

type LocalDb = {
  users: User[];
  weeks: Week[];
  submissions: Submission[];
  activeLiveSession: LiveSession | null;
};

export const sampleUsers = [
  { name: "Aarav", role: "student" as const, topPerformer: true },
  { name: "Diya", role: "student" as const, topPerformer: false },
  { name: "Karthik", role: "student" as const, topPerformer: false },
  { name: "Facilitator Demo", role: "facilitator" as const, topPerformer: false }
];

export const sampleSubmissionTemplates = [
  {
    weekId: 1,
    type: "automation-risk-matrix",
    score: 86,
    content: {
      targetIndustry: "Banking",
      targetRole: "Data Analyst",
      summary: "High viability due to demand concentration across SQL, Excel, and Power BI.",
      risks: ["Manual data entry", "routine reporting"],
      growthRoles: ["AI Product Analyst", "Data Analyst"]
    }
  },
  {
    weekId: 2,
    type: "industry-ai-map",
    score: 90,
    content: {
      useCases: [
        {
          title: "Credit Risk Scoring",
          businessProblem: "Prioritize loan approvals with lower default risk",
          tools: "Python, logistic regression, Colab",
          owner: "Risk Analyst"
        }
      ]
    }
  },
  {
    weekId: 6,
    type: "project-builder",
    score: 94,
    content: {
      title: "Customer Default Risk Analysis for an Indian NBFC",
      dataset: "UCI Credit Risk dataset",
      tools: ["Python", "scikit-learn", "GitHub"],
      githubUrl: "https://github.com/example/default-risk-analysis"
    }
  },
  {
    weekId: 8,
    type: "ninety-day-plan",
    score: 88,
    content: {
      phaseOneGoal: "Complete PL-300 and polish Week 6 project",
      applicationsTarget: 20,
      outreachTarget: 10
    }
  }
];

function nowIso() {
  return new Date().toISOString();
}

function makeUser(name: string, role: Role, topPerformer = false): User {
  return {
    id: crypto.randomUUID(),
    name,
    role,
    topPerformer
  };
}

function sameIdentity(user: Pick<User, "name" | "role">, candidate: Pick<User, "name" | "role">) {
  return user.name === candidate.name && user.role === candidate.role;
}

function buildSeedDb(): LocalDb {
  const users = sampleUsers.map((item) => makeUser(item.name, item.role, item.topPerformer));
  const students = users.filter((user) => user.role === "student");
  const submissions: Submission[] = [];

  for (const student of students) {
    for (const template of sampleSubmissionTemplates) {
      const week = curriculumWeeks.find((entry) => entry.id === template.weekId)!;
      submissions.push({
        id: crypto.randomUUID(),
        userId: student.id,
        weekId: template.weekId,
        type: template.type,
        content: template.content,
        score: template.score,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        user: student,
        week
      });
    }
  }

  return {
    users,
    weeks: curriculumWeeks,
    submissions,
    activeLiveSession: {
      id: crypto.randomUUID(),
      weekId: 1,
      sessionType: "A",
      isActive: true,
      presentationIdx: 0,
      activityTitle: "Kickoff discussion",
      activityBody: {
        prompt: "Share one role you think AI will change fastest in your target industry."
      },
      week: curriculumWeeks[0]
    }
  };
}

function readDb(): LocalDb {
  const raw = localStorage.getItem(dbKey);
  if (!raw) {
    const seeded = buildSeedDb();
    writeDb(seeded);
    return seeded;
  }

  const parsed = JSON.parse(raw) as LocalDb;
  return parsed;
}

function writeDb(db: LocalDb) {
  localStorage.setItem(dbKey, JSON.stringify(db));
}

function withDb<T>(callback: (db: LocalDb) => T): T {
  const db = readDb();
  const result = callback(db);
  writeDb(db);
  return result;
}

function computeDashboard(user: User, db: LocalDb): DashboardPayload {
  const submissions = user.role === "student" ? db.submissions.filter((entry) => entry.userId === user.id) : db.submissions;
  const byWeek = db.weeks.map((week) => ({
    weekId: week.id,
    completed: submissions.some((entry) => entry.weekId === week.id && entry.userId === user.id)
  }));

  const completedWeeks = byWeek.filter((entry) => entry.completed).length;
  return {
    user,
    weeks: db.weeks,
    submissions,
    activeLiveSession: db.activeLiveSession,
    cohortStats: db.weeks.map((week) => ({
      weekId: week.id,
      submissions: db.submissions.filter((entry) => entry.weekId === week.id).length
    })),
    progress: {
      completedWeeks,
      totalWeeks: db.weeks.length,
      percent: Math.round((completedWeeks / db.weeks.length) * 100),
      byWeek
    }
  };
}

function refreshSubmissionRelations(db: LocalDb) {
  db.submissions = db.submissions.map((submission) => ({
    ...submission,
    user: db.users.find((user) => user.id === submission.userId)!,
    week: db.weeks.find((week) => week.id === submission.weekId)!
  }));

  if (db.activeLiveSession) {
    db.activeLiveSession = {
      ...db.activeLiveSession,
      week: db.weeks.find((week) => week.id === db.activeLiveSession?.weekId)!
    };
  }
}

export const localApi = {
  async login(name: string, role: Role): Promise<User> {
    return withDb((db) => {
      const existing = db.users.find((user) => user.name === name && user.role === role);
      if (existing) return existing;
      const created = makeUser(name, role, false);
      db.users.push(created);
      return created;
    });
  },

  async dashboard(userId: string): Promise<DashboardPayload> {
    const db = readDb();
    refreshSubmissionRelations(db);
    const user = db.users.find((entry) => entry.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    return computeDashboard(user, db);
  },

  async weeks(): Promise<Week[]> {
    return readDb().weeks;
  },

  async submissions(weekId?: number, userId?: string): Promise<Submission[]> {
    const db = readDb();
    refreshSubmissionRelations(db);
    return db.submissions.filter((entry) => (weekId ? entry.weekId === weekId : true) && (userId ? entry.userId === userId : true));
  },

  async createSubmission(payload: {
    userId: string;
    weekId: number;
    type: string;
    content: Record<string, unknown>;
    score?: number;
  }): Promise<Submission> {
    return withDb((db) => {
      const user = db.users.find((entry) => entry.id === payload.userId)!;
      const week = db.weeks.find((entry) => entry.id === payload.weekId)!;
      const submission: Submission = {
        id: crypto.randomUUID(),
        userId: payload.userId,
        weekId: payload.weekId,
        type: payload.type,
        content: payload.content,
        score: payload.score ?? null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        user,
        week
      };
      db.submissions.unshift(submission);
      return submission;
    });
  },

  async facilitatorOverview(): Promise<FacilitatorOverview> {
    const db = readDb();
    refreshSubmissionRelations(db);
    const topPerformers = db.users
      .filter((entry) => entry.role === "student")
      .map((user) => {
        const userSubs = db.submissions.filter((entry) => entry.userId === user.id);
        const avgScore = userSubs.length
          ? Math.round(userSubs.reduce((sum, entry) => sum + (entry.score ?? 0), 0) / userSubs.length)
          : 0;
        return {
          id: user.id,
          name: user.name,
          avgScore,
          topPerformer: user.topPerformer,
          submissions: userSubs.length
        };
      })
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    const pollAggregation = db.weeks.flatMap((week) => {
      const grouped = new Map<string, number>();
      for (const submission of db.submissions.filter((entry) => entry.weekId === week.id)) {
        grouped.set(submission.type, (grouped.get(submission.type) ?? 0) + 1);
      }
      return [...grouped.entries()].map(([type, total]) => ({
        weekId: week.id,
        type,
        _count: { _all: total }
      }));
    });

    return {
      weeks: db.weeks,
      recentSubmissions: [...db.submissions].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 25),
      topPerformers,
      pollAggregation
    };
  },

  async startLiveSession(weekId: number, sessionType: "A" | "B"): Promise<LiveSession> {
    return withDb((db) => {
      const week = db.weeks.find((entry) => entry.id === weekId)!;
      db.activeLiveSession = {
        id: crypto.randomUUID(),
        weekId,
        sessionType,
        isActive: true,
        presentationIdx: 0,
        activityTitle: null,
        activityBody: null,
        week
      };
      return db.activeLiveSession;
    });
  },

  async currentLiveSession(): Promise<LiveSession | null> {
    const db = readDb();
    refreshSubmissionRelations(db);
    return db.activeLiveSession;
  },

  async updateSlide(id: string, presentationIdx: number): Promise<LiveSession> {
    return withDb((db) => {
      if (!db.activeLiveSession || db.activeLiveSession.id !== id) {
        throw new Error("Live session not found");
      }
      db.activeLiveSession.presentationIdx = presentationIdx;
      return db.activeLiveSession;
    });
  },

  async triggerActivity(id: string, activityTitle: string, activityBody: Record<string, unknown>): Promise<LiveSession> {
    return withDb((db) => {
      if (!db.activeLiveSession || db.activeLiveSession.id !== id) {
        throw new Error("Live session not found");
      }
      db.activeLiveSession.activityTitle = activityTitle;
      db.activeLiveSession.activityBody = activityBody;
      return db.activeLiveSession;
    });
  },

  async setTopPerformer(id: string, topPerformer: boolean): Promise<User> {
    return withDb((db) => {
      const user = db.users.find((entry) => entry.id === id);
      if (!user) {
        throw new Error("User not found");
      }
      user.topPerformer = topPerformer;
      refreshSubmissionRelations(db);
      return user;
    });
  },

  async resetDemoData(currentUser?: Pick<User, "name" | "role"> | null): Promise<User | null> {
    const db = buildSeedDb();
    let preservedUser: User | null = null;

    if (currentUser) {
      const existing = db.users.find((entry) => sameIdentity(entry, currentUser));
      preservedUser = existing ?? makeUser(currentUser.name, currentUser.role, false);
      if (!existing) {
        db.users.push(preservedUser);
      }
    }

    writeDb(db);
    return preservedUser;
  },

  async restoreUser(user: Pick<User, "id" | "name" | "role" | "topPerformer">): Promise<User> {
    return withDb((db) => {
      const existingById = db.users.find((entry) => entry.id === user.id);
      if (existingById) {
        return existingById;
      }

      const existingByIdentity = db.users.find((entry) => sameIdentity(entry, user));
      if (existingByIdentity) {
        return existingByIdentity;
      }

      const recreated = makeUser(user.name, user.role, user.topPerformer);
      db.users.push(recreated);
      return recreated;
    });
  }
};
