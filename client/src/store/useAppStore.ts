import { create } from "zustand";
import { api } from "../lib/api";
import type { DashboardPayload, FacilitatorOverview, LiveSession, Role, Submission, User } from "../lib/types";

type AppState = {
  user: User | null;
  dashboard: DashboardPayload | null;
  facilitatorOverview: FacilitatorOverview | null;
  activeLiveSession: LiveSession | null;
  loading: boolean;
  error: string | null;
  login: (name: string, role: Role) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  refreshFacilitatorOverview: () => Promise<void>;
  refreshLiveSession: () => Promise<void>;
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
  toggleTopPerformer: (id: string, topPerformer: boolean) => Promise<void>;
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
  facilitatorOverview: null,
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
      if (role === "facilitator") {
        await get().refreshFacilitatorOverview();
      }
      await get().refreshLiveSession();
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
  refreshFacilitatorOverview: async () => {
    if (get().user?.role !== "facilitator") return;
    try {
      const facilitatorOverview = await api.facilitatorOverview();
      set({ facilitatorOverview, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to refresh facilitator overview" });
      throw error;
    }
  },
  refreshLiveSession: async () => {
    try {
      const activeLiveSession = await api.currentLiveSession();
      set({ activeLiveSession, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to refresh live session" });
      throw error;
    }
  },
  submitWork: async (payload) => {
    try {
      const submission = await api.createSubmission(payload);
      await get().refreshDashboard();
      if (get().user?.role === "facilitator") {
        await get().refreshFacilitatorOverview();
      }
      set({ error: null });
      return submission;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to save submission" });
      throw error;
    }
  },
  startLiveSession: async (weekId, sessionType) => {
    try {
      const activeLiveSession = await api.startLiveSession(weekId, sessionType);
      set({ activeLiveSession, error: null });
      await get().refreshDashboard();
      await get().refreshFacilitatorOverview();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to start live session" });
      throw error;
    }
  },
  updateSlide: async (presentationIdx) => {
    const liveSession = get().activeLiveSession;
    if (!liveSession) return;
    try {
      const activeLiveSession = await api.updateSlide(liveSession.id, presentationIdx);
      set({ activeLiveSession, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to update slide" });
      throw error;
    }
  },
  triggerActivity: async (activityTitle, activityBody) => {
    const liveSession = get().activeLiveSession;
    if (!liveSession) return;
    try {
      const activeLiveSession = await api.triggerActivity(liveSession.id, activityTitle, activityBody);
      set({ activeLiveSession, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to trigger activity" });
      throw error;
    }
  },
  toggleTopPerformer: async (id, topPerformer) => {
    try {
      await api.setTopPerformer(id, topPerformer);
      await get().refreshFacilitatorOverview();
      await get().refreshDashboard();
      set({ error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to update top performer" });
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
      if (get().user?.role === "facilitator") {
        await get().refreshFacilitatorOverview();
      }
      await get().refreshLiveSession();
      set({ error: null });
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
      if (user.role === "facilitator") {
        await get().refreshFacilitatorOverview();
      }
      await get().refreshLiveSession();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to restore session" });
    }
  },
  logout: () => {
    sessionStorage.removeItem(storageKey);
    set({
      user: null,
      dashboard: null,
      facilitatorOverview: null,
      activeLiveSession: null,
      error: null
    });
  }
}));
