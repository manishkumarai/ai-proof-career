export type Role = "student" | "facilitator";

export type Week = {
  id: number;
  slug: string;
  title: string;
  theme: string;
  sessionATheme: string;
  sessionABody: string[];
  sessionBTheme: string;
  sessionBBody: string;
  deliverable: string;
  asyncContent: string;
  toolsUsed: string[];
  activities: Record<string, unknown>;
};

export type User = {
  id: string;
  name: string;
  role: Role;
  topPerformer: boolean;
};

export type Submission = {
  id: string;
  userId: string;
  weekId: number;
  type: string;
  content: Record<string, unknown>;
  score?: number | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  week: Week;
};

export type LiveSession = {
  id: string;
  weekId: number;
  sessionType: "A" | "B";
  isActive: boolean;
  presentationIdx: number;
  activityTitle?: string | null;
  activityBody?: Record<string, unknown> | null;
  week: Week;
};

export type DashboardPayload = {
  user: User;
  weeks: Week[];
  submissions: Submission[];
  activeLiveSession: LiveSession | null;
  cohortStats: Array<{ weekId: number; submissions: number }>;
  progress: {
    completedWeeks: number;
    totalWeeks: number;
    percent: number;
    byWeek: Array<{ weekId: number; completed: boolean }>;
  };
};

export type FacilitatorOverview = {
  weeks: Week[];
  recentSubmissions: Submission[];
  topPerformers: Array<{
    id: string;
    name: string;
    avgScore: number;
    topPerformer: boolean;
    submissions: number;
  }>;
  pollAggregation: Array<{
    weekId: number;
    type: string;
    _count: { _all: number };
  }>;
};
