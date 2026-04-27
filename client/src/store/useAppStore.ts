import { create } from "zustand";
import { api } from "../lib/api";
import type { DashboardPayload, LiveSession, Role, Submission, User } from "../lib/types";

type AppState = {
  user: User | null;
  dashboard: DashboardPayload | null;
  activeLiveSession: LiveSession | null;
  loading: boolean;
  error: string | null;
  login: (name: string, role: Role) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  submitWork: (payload: {
    userId: string;
    weekId: number;
    type: string;
    content: Record<string, unknown>;
    score?: number;
  }) => Promise<Submission>;
  startLiveSession: (weekId: number, sessionType: "A" | "B") => Promise<void>;
  updateSlide: (presentationIdx: number) => Promise<void>;
  triggerActivity: (activityTitle: string, activityBody: Record<string, unknown>) => Promise<void>;
  resetDemoData: () => Promise<void>;
  setError: (message: string | null) => void;
  loadStoredSession: () => Promise<void>;
  logout: () => void;
};

const storageKey = "ai-career1-session";

async function ensureFreshUser(user: User): Promise<User> {
  const restored = await api.restoreUser(user);
  sessionStorage.setItem(storageKey, JSON.stringify(restored));
  return restored;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  dashboard: null,
  activeLiveSession: null,
  loading: false,
  error: null,
  setError: (message) => set({ error: message }),
  login: async (name, role) => {
    set({ loading: true, error: null });
    try {
      const user = await api.login(name, role);
      sessionStorage.setItem(storageKey, JSON.stringify(user));
      set({ user });
      await get().refreshDashboard();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Login failed" });
    } finally {
      set({ loading: false });
    }
  },
  refreshDashboard: async () => {
    let user = get().user;
    if (!user) return;
    try {
      const dashboard = await api.dashboard(user.id);
      set({ dashboard, activeLiveSession: dashboard.activeLiveSession, error: null });
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        user = await ensureFreshUser(user);
        set({ user });
        const dashboard = await api.dashboard(user.id);
        set({ dashboard, activeLiveSession: dashboard.activeLiveSession, error: null });
        return;
      }
      set({ error: error instanceof Error ? error.message : "Unable to refresh dashboard" });
      throw error;
    }
  },
  submitWork: async (payload) => {
    try {
      const submission = await api.createSubmission(payload);
      await get().refreshDashboard();
      set({ error: null });
      return submission;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to save submission" });
      throw error;
    }
  },
  startLiveSession: async (weekId, sessionType) => {
    try {
      // Local-only: Create session in state without API call
      const dashboard = get().dashboard;
      if (!dashboard) return;
      
      const week = dashboard.weeks.find((w) => w.id === weekId);
      if (!week) return;
      
      const activeLiveSession: LiveSession = {
        id: `demo-${Date.now()}`,
        weekId,
        sessionType,
        week,
        isActive: true,
        presentationIdx: 0,
        activityTitle: null,
        activityBody: null
      };
      
      set({ activeLiveSession, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to start live session" });
      throw error;
    }
  },
  updateSlide: async (presentationIdx) => {
    const liveSession = get().activeLiveSession;
    if (!liveSession) return;
    try {
      // Local-only: Update in-memory session state
      const updated: LiveSession = {
        ...liveSession,
        presentationIdx
      };
      set({ activeLiveSession: updated, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to update slide" });
      throw error;
    }
  },
  triggerActivity: async (activityTitle, activityBody) => {
    const liveSession = get().activeLiveSession;
    if (!liveSession) return;
    try {
      // Local-only: Update in-memory session state
      const updated: LiveSession = {
        ...liveSession,
        activityTitle,
        activityBody
      };
      set({ activeLiveSession: updated, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to trigger activity" });
      throw error;
    }
  },
  resetDemoData: async () => {
    const currentUser = get().user;
    try {
      const preservedUser = await api.resetDemoData(currentUser ? { name: currentUser.name, role: currentUser.role } : null);
      if (preservedUser) {
        sessionStorage.setItem(storageKey, JSON.stringify(preservedUser));
        set({ user: preservedUser });
      }
      await get().refreshDashboard();
      set({ activeLiveSession: null, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to reset demo data" });
      throw error;
    }
  },
  loadStoredSession: async () => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return;
    try {
      let user = JSON.parse(raw) as User;
      user = await ensureFreshUser(user);
      set({ user, error: null });
      await get().refreshDashboard();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to restore session" });
    }
  },
  logout: () => {
    sessionStorage.removeItem(storageKey);
    set({
      user: null,
      dashboard: null,
      activeLiveSession: null,
      error: null
    });
  }
}));
