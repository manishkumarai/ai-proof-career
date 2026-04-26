import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { curriculumWeeks, sampleSubmissionTemplates, sampleUsers } from "../data/curriculum.js";

const dataDir = path.resolve(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "ai-career-os.db");
export const db = new DatabaseSync(dbPath);

export type SqlValue = string | number | bigint | Uint8Array | null;

function run(statement: string, ...params: SqlValue[]) {
  return db.prepare(statement).run(...params);
}

function get<T>(statement: string, ...params: SqlValue[]) {
  return db.prepare(statement).get(...params) as T | undefined;
}

function all<T>(statement: string, ...params: SqlValue[]) {
  return db.prepare(statement).all(...params) as T[];
}

function serialiseJson(value: unknown) {
  return JSON.stringify(value ?? {});
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      topPerformer INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weeks (
      id INTEGER PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      theme TEXT NOT NULL,
      sessionATheme TEXT NOT NULL,
      sessionABody TEXT NOT NULL,
      sessionBTheme TEXT NOT NULL,
      sessionBBody TEXT NOT NULL,
      deliverable TEXT NOT NULL,
      asyncContent TEXT NOT NULL,
      toolsUsed TEXT NOT NULL,
      activities TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      weekId INTEGER NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      score INTEGER,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (weekId) REFERENCES weeks(id)
    );

    CREATE TABLE IF NOT EXISTS liveSessions (
      id TEXT PRIMARY KEY,
      weekId INTEGER NOT NULL,
      sessionType TEXT NOT NULL,
      isActive INTEGER NOT NULL DEFAULT 1,
      presentationIdx INTEGER NOT NULL DEFAULT 0,
      activityTitle TEXT,
      activityBody TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (weekId) REFERENCES weeks(id)
    );
  `);

  const weekCount = get<{ count: number }>("SELECT COUNT(*) as count FROM weeks")?.count ?? 0;
  if (weekCount > 0) return;

  const now = new Date().toISOString();

  for (const week of curriculumWeeks) {
    run(
      `INSERT INTO weeks (id, slug, title, theme, sessionATheme, sessionABody, sessionBTheme, sessionBBody, deliverable, asyncContent, toolsUsed, activities)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      week.id,
      week.slug,
      week.title,
      week.theme,
      week.sessionATheme,
      serialiseJson(week.sessionABody),
      week.sessionBTheme,
      week.sessionBBody,
      week.deliverable,
      week.asyncContent,
      serialiseJson(week.toolsUsed),
      serialiseJson(week.activities)
    );
  }

  const createdUsers = sampleUsers.map((user) => {
    const id = randomUUID();
    run(
      "INSERT INTO users (id, name, role, topPerformer, createdAt) VALUES (?, ?, ?, ?, ?)",
      id,
      user.name,
      user.role,
      user.topPerformer ? 1 : 0,
      now
    );
    return { ...user, id };
  });

  const students = createdUsers.filter((user) => user.role === "student");
  for (const student of students) {
    for (const template of sampleSubmissionTemplates) {
      run(
        `INSERT INTO submissions (id, userId, weekId, type, content, score, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        randomUUID(),
        student.id,
        template.weekId,
        template.type,
        serialiseJson(template.content),
        template.score ?? null,
        now,
        now
      );
    }
  }

  run(
    `INSERT INTO liveSessions (id, weekId, sessionType, isActive, presentationIdx, activityTitle, activityBody, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    randomUUID(),
    1,
    "A",
    1,
    0,
    "Kickoff discussion",
    serialiseJson({ prompt: "Share one role you think AI will change fastest in your target industry." }),
    now,
    now
  );
}

export function queryDb() {
  return { run, get, all, serialiseJson };
}
