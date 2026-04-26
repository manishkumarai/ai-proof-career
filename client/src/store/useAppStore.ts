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
  loadStoredSession: () => Promise<void>;
  logout: () => void;
};

const storageKey = "ai-career1-session";

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  dashboard: null,
  facilitatorOverview: null,
  activeLiveSession: null,
  loading: false,
  error: null,
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
    const user = get().user;
    if (!user) return;
    const dashboard = await api.dashboard(user.id);
    set({ dashboard, activeLiveSession: dashboard.activeLiveSession });
  },
  refreshFacilitatorOverview: async () => {
    if (get().user?.role !== "facilitator") return;
    const facilitatorOverview = await api.facilitatorOverview();
    set({ facilitatorOverview });
  },
  refreshLiveSession: async () => {
    const activeLiveSession = await api.currentLiveSession();
    set({ activeLiveSession });
  },
  submitWork: async (payload) => {
    const submission = await api.createSubmission(payload);
    await get().refreshDashboard();
    if (get().user?.role === "facilitator") {
      await get().refreshFacilitatorOverview();
    }
    return submission;
  },
  startLiveSession: async (weekId, sessionType) => {
    const activeLiveSession = await api.startLiveSession(weekId, sessionType);
    set({ activeLiveSession });
    await get().refreshDashboard();
    await get().refreshFacilitatorOverview();
  },
  updateSlide: async (presentationIdx) => {
    const liveSession = get().activeLiveSession;
    if (!liveSession) return;
    const activeLiveSession = await api.updateSlide(liveSession.id, presentationIdx);
    set({ activeLiveSession });
  },
  triggerActivity: async (activityTitle, activityBody) => {
    const liveSession = get().activeLiveSession;
    if (!liveSession) return;
    const activeLiveSession = await api.triggerActivity(liveSession.id, activityTitle, activityBody);
    set({ activeLiveSession });
  },
  toggleTopPerformer: async (id, topPerformer) => {
    await api.setTopPerformer(id, topPerformer);
    await get().refreshFacilitatorOverview();
    await get().refreshDashboard();
  },
  resetDemoData: async () => {
    await api.resetDemoData();
    const raw = sessionStorage.getItem(storageKey);
    if (raw) {
      const user = JSON.parse(raw) as User;
      set({ user });
      await get().refreshDashboard();
      if (user.role === "facilitator") {
        await get().refreshFacilitatorOverview();
      }
      await get().refreshLiveSession();
    }
  },
  loadStoredSession: async () => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return;
    const user = JSON.parse(raw) as User;
    set({ user });
    await get().refreshDashboard();
    if (user.role === "facilitator") {
      await get().refreshFacilitatorOverview();
    }
    await get().refreshLiveSession();
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
