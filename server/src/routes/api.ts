import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { parseJson, queryDb } from "../lib/db.js";
import type { SqlValue } from "../lib/db.js";

const router = Router();
const { all, get, run, serialiseJson } = queryDb();

const loginSchema = z.object({
  name: z.string().min(2),
  role: z.enum(["student", "facilitator"])
});

const submissionSchema = z.object({
  userId: z.string().min(1),
  weekId: z.number().int().min(1).max(8),
  type: z.string().min(2),
  content: z.record(z.any()),
  score: z.number().int().min(0).max(100).optional()
});

const liveSessionSchema = z.object({
  weekId: z.number().int().min(1).max(8),
  sessionType: z.enum(["A", "B"]),
  presentationIdx: z.number().int().min(0).default(0)
});

const liveActivitySchema = z.object({
  activityTitle: z.string().min(2),
  activityBody: z.record(z.any())
});

type UserRow = {
  id: string;
  name: string;
  role: "student" | "facilitator";
  topPerformer: number;
  createdAt: string;
};

type WeekRow = {
  id: number;
  slug: string;
  title: string;
  theme: string;
  sessionATheme: string;
  sessionABody: string;
  sessionBTheme: string;
  sessionBBody: string;
  deliverable: string;
  asyncContent: string;
  toolsUsed: string;
  activities: string;
};

type SubmissionRow = {
  id: string;
  userId: string;
  weekId: number;
  type: string;
  content: string;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userRole: "student" | "facilitator";
  topPerformer: number;
  weekSlug: string;
  weekTitle: string;
  weekTheme: string;
  sessionATheme: string;
  sessionABody: string;
  sessionBTheme: string;
  sessionBBody: string;
  deliverable: string;
  asyncContent: string;
  toolsUsed: string;
  activities: string;
};

type LiveSessionRow = {
  id: string;
  weekId: number;
  sessionType: "A" | "B";
  isActive: number;
  presentationIdx: number;
  activityTitle: string | null;
  activityBody: string | null;
  createdAt: string;
  updatedAt: string;
  weekSlug: string;
  weekTitle: string;
  weekTheme: string;
  sessionATheme: string;
  sessionABody: string;
  sessionBTheme: string;
  sessionBBody: string;
  deliverable: string;
  asyncContent: string;
  toolsUsed: string;
  activities: string;
};

function mapUser(row: UserRow) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    topPerformer: Boolean(row.topPerformer),
    createdAt: row.createdAt
  };
}

function mapWeek(row: WeekRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    theme: row.theme,
    sessionATheme: row.sessionATheme,
    sessionABody: parseJson<string[]>(row.sessionABody, []),
    sessionBTheme: row.sessionBTheme,
    sessionBBody: row.sessionBBody,
    deliverable: row.deliverable,
    asyncContent: row.asyncContent,
    toolsUsed: parseJson<string[]>(row.toolsUsed, []),
    activities: parseJson<Record<string, unknown>>(row.activities, {})
  };
}

function mapSubmission(row: SubmissionRow) {
  return {
    id: row.id,
    userId: row.userId,
    weekId: row.weekId,
    type: row.type,
    content: parseJson<Record<string, unknown>>(row.content, {}),
    score: row.score,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    user: {
      id: row.userId,
      name: row.userName,
      role: row.userRole,
      topPerformer: Boolean(row.topPerformer)
    },
    week: mapWeek({
      id: row.weekId,
      slug: row.weekSlug,
      title: row.weekTitle,
      theme: row.weekTheme,
      sessionATheme: row.sessionATheme,
      sessionABody: row.sessionABody,
      sessionBTheme: row.sessionBTheme,
      sessionBBody: row.sessionBBody,
      deliverable: row.deliverable,
      asyncContent: row.asyncContent,
      toolsUsed: row.toolsUsed,
      activities: row.activities
    })
  };
}

function mapLiveSession(row: LiveSessionRow | undefined | null) {
  if (!row) return null;
  return {
    id: row.id,
    weekId: row.weekId,
    sessionType: row.sessionType,
    isActive: Boolean(row.isActive),
    presentationIdx: row.presentationIdx,
    activityTitle: row.activityTitle,
    activityBody: parseJson<Record<string, unknown> | null>(row.activityBody, null),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    week: mapWeek({
      id: row.weekId,
      slug: row.weekSlug,
      title: row.weekTitle,
      theme: row.weekTheme,
      sessionATheme: row.sessionATheme,
      sessionABody: row.sessionABody,
      sessionBTheme: row.sessionBTheme,
      sessionBBody: row.sessionBBody,
      deliverable: row.deliverable,
      asyncContent: row.asyncContent,
      toolsUsed: row.toolsUsed,
      activities: row.activities
    })
  };
}

function listWeeks() {
  return all<WeekRow>("SELECT * FROM weeks ORDER BY id ASC").map(mapWeek);
}

function listSubmissions(whereClause = "", params: SqlValue[] = []) {
  const rows = all<SubmissionRow>(
    `SELECT
      s.*,
      u.name as userName,
      u.role as userRole,
      u.topPerformer as topPerformer,
      w.slug as weekSlug,
      w.title as weekTitle,
      w.theme as weekTheme,
      w.sessionATheme as sessionATheme,
      w.sessionABody as sessionABody,
      w.sessionBTheme as sessionBTheme,
      w.sessionBBody as sessionBBody,
      w.deliverable as deliverable,
      w.asyncContent as asyncContent,
      w.toolsUsed as toolsUsed,
      w.activities as activities
    FROM submissions s
    JOIN users u ON u.id = s.userId
    JOIN weeks w ON w.id = s.weekId
    ${whereClause}
    ORDER BY s.updatedAt DESC`,
    ...params
  );

  return rows.map(mapSubmission);
}

function currentLiveSession() {
  const row = get<LiveSessionRow>(
    `SELECT
      l.*,
      w.slug as weekSlug,
      w.title as weekTitle,
      w.theme as weekTheme,
      w.sessionATheme as sessionATheme,
      w.sessionABody as sessionABody,
      w.sessionBTheme as sessionBTheme,
      w.sessionBBody as sessionBBody,
      w.deliverable as deliverable,
      w.asyncContent as asyncContent,
      w.toolsUsed as toolsUsed,
      w.activities as activities
    FROM liveSessions l
    JOIN weeks w ON w.id = l.weekId
    WHERE l.isActive = 1
    ORDER BY l.updatedAt DESC
    LIMIT 1`
  );

  return mapLiveSession(row);
}

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const existing = get<UserRow>("SELECT * FROM users WHERE name = ? AND role = ? LIMIT 1", parsed.data.name, parsed.data.role);
  if (existing) {
    return res.json(mapUser(existing));
  }

  const now = new Date().toISOString();
  const id = randomUUID();
  run(
    "INSERT INTO users (id, name, role, topPerformer, createdAt) VALUES (?, ?, ?, ?, ?)",
    id,
    parsed.data.name,
    parsed.data.role,
    0,
    now
  );

  const created = get<UserRow>("SELECT * FROM users WHERE id = ?", id);
  return res.json(created ? mapUser(created) : null);
});

router.get("/weeks", (_req, res) => {
  res.json(listWeeks());
});

router.get("/dashboard/:userId", (req, res) => {
  const user = get<UserRow>("SELECT * FROM users WHERE id = ?", req.params.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const weeks = listWeeks();
  const submissions =
    user.role === "student"
      ? listSubmissions("WHERE s.userId = ?", [user.id])
      : listSubmissions();

  const progressByWeek = weeks.map((week) => ({
    weekId: week.id,
    completed: submissions.some((submission) => submission.weekId === week.id && submission.userId === user.id)
  }));

  const cohortStats = all<{ weekId: number; submissions: number }>(
    "SELECT weekId, COUNT(*) as submissions FROM submissions GROUP BY weekId ORDER BY weekId ASC"
  );

  res.json({
    user: mapUser(user),
    weeks,
    submissions,
    activeLiveSession: currentLiveSession(),
    cohortStats,
    progress: {
      completedWeeks: progressByWeek.filter((entry) => entry.completed).length,
      totalWeeks: weeks.length,
      percent:
        weeks.length === 0 ? 0 : Math.round((progressByWeek.filter((entry) => entry.completed).length / weeks.length) * 100),
      byWeek: progressByWeek
    }
  });
});

router.get("/submissions", (req, res) => {
  const conditions: string[] = [];
  const params: SqlValue[] = [];

  if (req.query.weekId) {
    conditions.push("s.weekId = ?");
    params.push(Number(req.query.weekId));
  }

  if (req.query.userId) {
    conditions.push("s.userId = ?");
    params.push(String(req.query.userId));
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  res.json(listSubmissions(whereClause, params));
});

router.post("/submissions", (req, res) => {
  const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const now = new Date().toISOString();
  const id = randomUUID();
  run(
    `INSERT INTO submissions (id, userId, weekId, type, content, score, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    parsed.data.userId,
    parsed.data.weekId,
    parsed.data.type,
    serialiseJson(parsed.data.content),
    parsed.data.score ?? null,
    now,
    now
  );

  const created = listSubmissions("WHERE s.id = ?", [id])[0];
  res.status(201).json(created);
});

router.post("/live-session/start", (req, res) => {
  const parsed = liveSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const now = new Date().toISOString();
  run("UPDATE liveSessions SET isActive = 0, updatedAt = ?", now);

  const id = randomUUID();
  run(
    `INSERT INTO liveSessions (id, weekId, sessionType, isActive, presentationIdx, activityTitle, activityBody, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    parsed.data.weekId,
    parsed.data.sessionType,
    1,
    parsed.data.presentationIdx,
    null,
    null,
    now,
    now
  );

  res.status(201).json(currentLiveSession());
});

router.post("/live-session/:id/slide", (req, res) => {
  const parsed = z.object({ presentationIdx: z.number().int().min(0) }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  run("UPDATE liveSessions SET presentationIdx = ?, updatedAt = ? WHERE id = ?", parsed.data.presentationIdx, new Date().toISOString(), req.params.id);
  res.json(currentLiveSession());
});

router.post("/live-session/:id/activity", (req, res) => {
  const parsed = liveActivitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  run(
    "UPDATE liveSessions SET activityTitle = ?, activityBody = ?, updatedAt = ? WHERE id = ?",
    parsed.data.activityTitle,
    serialiseJson(parsed.data.activityBody),
    new Date().toISOString(),
    req.params.id
  );

  res.json(currentLiveSession());
});

router.get("/live-session/current", (_req, res) => {
  res.json(currentLiveSession());
});

router.get("/facilitator/overview", (_req, res) => {
  const weeks = listWeeks();
  const recentSubmissions = listSubmissions().slice(0, 25);
  const topPerformers = all<
    UserRow & {
      avgScore: number | null;
      submissions: number;
    }
  >(
    `SELECT
      u.*,
      ROUND(AVG(COALESCE(s.score, 0))) as avgScore,
      COUNT(s.id) as submissions
    FROM users u
    LEFT JOIN submissions s ON s.userId = u.id
    WHERE u.role = 'student'
    GROUP BY u.id
    ORDER BY avgScore DESC
    LIMIT 5`
  ).map((row) => ({
    id: row.id,
    name: row.name,
    avgScore: row.avgScore ?? 0,
    topPerformer: Boolean(row.topPerformer),
    submissions: row.submissions
  }));

  const pollAggregation = all<{ weekId: number; type: string; total: number }>(
    "SELECT weekId, type, COUNT(*) as total FROM submissions GROUP BY weekId, type ORDER BY weekId ASC"
  ).map((row) => ({
    weekId: row.weekId,
    type: row.type,
    _count: { _all: row.total }
  }));

  res.json({
    weeks,
    recentSubmissions,
    topPerformers,
    pollAggregation
  });
});

router.patch("/users/:id/top-performer", (req, res) => {
  const parsed = z.object({ topPerformer: z.boolean() }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  run("UPDATE users SET topPerformer = ? WHERE id = ?", parsed.data.topPerformer ? 1 : 0, req.params.id);
  const updated = get<UserRow>("SELECT * FROM users WHERE id = ?", req.params.id);
  res.json(updated ? mapUser(updated) : null);
});

export default router;
