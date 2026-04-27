import type { DashboardPayload, FacilitatorOverview, LiveSession, Role, Submission, User } from "./types";
import { curriculumWeeks, sampleSubmissionTemplates, sampleUsers } from "./localData";
import { supabase } from "./supabase";

type UserRecord = {
  id: string;
  name: string;
  role: Role;
  top_performer: boolean;
  created_at?: string;
};

type SubmissionRecord = {
  id: string;
  user_id: string;
  week_id: number;
  type: string;
  content: Record<string, unknown>;
  score: number | null;
  created_at: string;
  updated_at: string;
};

type LiveSessionRecord = {
  id: string;
  week_id: number;
  session_type: "A" | "B";
  is_active: boolean;
  presentation_idx: number;
  activity_title: string | null;
  activity_body: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
};

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }
  return supabase;
}

function mapUser(record: UserRecord): User {
  return {
    id: record.id,
    name: record.name,
    role: record.role,
    topPerformer: record.top_performer
  };
}

function mapSubmission(record: SubmissionRecord, users: User[]): Submission {
  const user = users.find((entry) => entry.id === record.user_id);
  const week = curriculumWeeks.find((entry) => entry.id === record.week_id);

  if (!user || !week) {
    throw new Error("Submission relation missing");
  }

  return {
    id: record.id,
    userId: record.user_id,
    weekId: record.week_id,
    type: record.type,
    content: record.content,
    score: record.score,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    user,
    week
  };
}

function mapLiveSession(record: LiveSessionRecord | null): LiveSession | null {
  if (!record) return null;
  const week = curriculumWeeks.find((entry) => entry.id === record.week_id);
  if (!week) {
    throw new Error("Live session week missing");
  }

  return {
    id: record.id,
    weekId: record.week_id,
    sessionType: record.session_type,
    isActive: record.is_active,
    presentationIdx: record.presentation_idx,
    activityTitle: record.activity_title,
    activityBody: record.activity_body,
    week
  };
}

async function fetchUsers(): Promise<User[]> {
  const client = requireSupabase();
  const { data, error } = await client.from("users").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((entry: unknown) => mapUser(entry as UserRecord));
}

async function fetchSubmissions(): Promise<Submission[]> {
  const client = requireSupabase();
  const [users, submissionsResult] = await Promise.all([
    fetchUsers(),
    client.from("submissions").select("*").order("updated_at", { ascending: false })
  ]);

  if (submissionsResult.error) throw submissionsResult.error;
  return (submissionsResult.data ?? []).map((entry: unknown) => mapSubmission(entry as SubmissionRecord, users));
}

async function fetchCurrentLiveSession(): Promise<LiveSession | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("live_sessions")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return mapLiveSession((data as LiveSessionRecord | null) ?? null);
}

async function computeDashboard(user: User): Promise<DashboardPayload> {
  const [allUsers, allSubmissions, activeLiveSession] = await Promise.all([
    fetchUsers(),
    fetchSubmissions(),
    fetchCurrentLiveSession()
  ]);

  const submissions = user.role === "student" ? allSubmissions.filter((entry) => entry.userId === user.id) : allSubmissions;
  const progressByWeek = curriculumWeeks.map((week) => ({
    weekId: week.id,
    completed: submissions.some((entry) => entry.weekId === week.id && entry.userId === user.id)
  }));
  const completedWeeks = progressByWeek.filter((entry) => entry.completed).length;

  return {
    user: allUsers.find((entry) => entry.id === user.id) ?? user,
    weeks: curriculumWeeks,
    submissions,
    activeLiveSession,
    cohortStats: curriculumWeeks.map((week) => ({
      weekId: week.id,
      submissions: allSubmissions.filter((entry) => entry.weekId === week.id).length
    })),
    progress: {
      completedWeeks,
      totalWeeks: curriculumWeeks.length,
      percent: Math.round((completedWeeks / curriculumWeeks.length) * 100),
      byWeek: progressByWeek
    }
  };
}

async function seedSupabaseBaseData() {
  const client = requireSupabase();
  const { count, error } = await client.from("users").select("*", { count: "exact", head: true });
  if (error) throw error;
  if ((count ?? 0) > 0) return;
  await resetSupabaseDemoData();
}

async function upsertUser(name: string, role: Role, topPerformer = false): Promise<User> {
  const client = requireSupabase();
  const { data: existing, error: selectError } = await client
    .from("users")
    .select("*")
    .eq("name", name)
    .eq("role", role)
    .limit(1)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) return mapUser(existing as UserRecord);

  const { data, error } = await client
    .from("users")
    .insert({
      name,
      role,
      top_performer: topPerformer
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapUser(data as UserRecord);
}

async function resetSupabaseDemoData(preservedIdentity?: Pick<User, "name" | "role"> | null): Promise<User | null> {
  const client = requireSupabase();

  const { error: liveDeleteError } = await client.from("live_sessions").delete().neq("id", "");
  if (liveDeleteError) throw liveDeleteError;

  const { error: submissionsDeleteError } = await client.from("submissions").delete().neq("id", "");
  if (submissionsDeleteError) throw submissionsDeleteError;

  const { error: usersDeleteError } = await client.from("users").delete().neq("id", "");
  if (usersDeleteError) throw usersDeleteError;

  const userMap = new Map<string, User>();
  for (const sampleUser of sampleUsers) {
    const user = await upsertUser(sampleUser.name, sampleUser.role, sampleUser.topPerformer);
    userMap.set(`${user.name}:${user.role}`, user);
  }

  const students = [...userMap.values()].filter((entry) => entry.role === "student");
  for (const student of students) {
    for (const template of sampleSubmissionTemplates) {
      const { error } = await client.from("submissions").insert({
        user_id: student.id,
        week_id: template.weekId,
        type: template.type,
        content: template.content,
        score: template.score ?? null
      });
      if (error) throw error;
    }
  }

  const { error: liveInsertError } = await client.from("live_sessions").insert({
    week_id: 1,
    session_type: "A",
    is_active: true,
    presentation_idx: 0,
    activity_title: "Kickoff discussion",
    activity_body: {
      prompt: "Share one role you think AI will change fastest in your target industry."
    }
  });
  if (liveInsertError) throw liveInsertError;

  if (!preservedIdentity) return null;
  return upsertUser(preservedIdentity.name, preservedIdentity.role, false);
}

export const supabaseApi = {
  async login(name: string, role: Role): Promise<User> {
    await seedSupabaseBaseData();
    return upsertUser(name, role, false);
  },

  async restoreUser(user: Pick<User, "id" | "name" | "role" | "topPerformer">): Promise<User> {
    await seedSupabaseBaseData();

    const client = requireSupabase();
    const { data, error } = await client.from("users").select("*").eq("id", user.id).limit(1).maybeSingle();
    if (error) throw error;
    if (data) return mapUser(data as UserRecord);
    return upsertUser(user.name, user.role, user.topPerformer);
  },

  async dashboard(userId: string): Promise<DashboardPayload> {
    await seedSupabaseBaseData();
    const users = await fetchUsers();
    const user = users.find((entry) => entry.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    return computeDashboard(user);
  },

  async weeks() {
    return curriculumWeeks;
  },

  async submissions(weekId?: number, userId?: string): Promise<Submission[]> {
    await seedSupabaseBaseData();
    const submissions = await fetchSubmissions();
    return submissions.filter((entry) => (weekId ? entry.weekId === weekId : true) && (userId ? entry.userId === userId : true));
  },

  async createSubmission(payload: {
    userId: string;
    weekId: number;
    type: string;
    content: Record<string, unknown>;
    score?: number;
  }): Promise<Submission> {
    const client = requireSupabase();
    const { data, error } = await client
      .from("submissions")
      .insert({
        user_id: payload.userId,
        week_id: payload.weekId,
        type: payload.type,
        content: payload.content,
        score: payload.score ?? null
      })
      .select("*")
      .single();
    if (error) throw error;

    const users = await fetchUsers();
    return mapSubmission(data as SubmissionRecord, users);
  },

  async facilitatorOverview(): Promise<FacilitatorOverview> {
    await seedSupabaseBaseData();
    const [users, submissions] = await Promise.all([fetchUsers(), fetchSubmissions()]);
    const topPerformers = users
      .filter((entry) => entry.role === "student")
      .map((user) => {
        const userSubs = submissions.filter((entry) => entry.userId === user.id);
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

    const pollAggregation = curriculumWeeks.flatMap((week) => {
      const grouped = new Map<string, number>();
      for (const submission of submissions.filter((entry) => entry.weekId === week.id)) {
        grouped.set(submission.type, (grouped.get(submission.type) ?? 0) + 1);
      }
      return [...grouped.entries()].map(([type, total]) => ({
        weekId: week.id,
        type,
        _count: { _all: total }
      }));
    });

    return {
      weeks: curriculumWeeks,
      recentSubmissions: submissions.slice(0, 25),
      topPerformers,
      pollAggregation
    };
  },

  async startLiveSession(weekId: number, sessionType: "A" | "B"): Promise<LiveSession> {
    const client = requireSupabase();
    const { error: deactivateError } = await client.from("live_sessions").update({ is_active: false }).eq("is_active", true);
    if (deactivateError) throw deactivateError;

    const { data, error } = await client
      .from("live_sessions")
      .insert({
        week_id: weekId,
        session_type: sessionType,
        is_active: true,
        presentation_idx: 0
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapLiveSession(data as LiveSessionRecord)!;
  },

  async currentLiveSession(): Promise<LiveSession | null> {
    await seedSupabaseBaseData();
    return fetchCurrentLiveSession();
  },

  async updateSlide(id: string, presentationIdx: number): Promise<LiveSession> {
    const client = requireSupabase();
    const { data, error } = await client
      .from("live_sessions")
      .update({
        presentation_idx: presentationIdx,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return mapLiveSession(data as LiveSessionRecord)!;
  },

  async triggerActivity(id: string, activityTitle: string, activityBody: Record<string, unknown>): Promise<LiveSession> {
    const client = requireSupabase();
    const { data, error } = await client
      .from("live_sessions")
      .update({
        activity_title: activityTitle,
        activity_body: activityBody,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return mapLiveSession(data as LiveSessionRecord)!;
  },

  async setTopPerformer(id: string, topPerformer: boolean): Promise<User> {
    const client = requireSupabase();
    const { data, error } = await client
      .from("users")
      .update({
        top_performer: topPerformer
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return mapUser(data as UserRecord);
  },

  async resetDemoData(currentUser?: Pick<User, "name" | "role"> | null): Promise<User | null> {
    return resetSupabaseDemoData(currentUser ?? null);
  }
};
