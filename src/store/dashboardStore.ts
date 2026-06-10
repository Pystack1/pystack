import { create } from "zustand";
import { api } from "@/services/api";

export interface DashboardData {
  total_courses: number;
  total_enquiries: number;
  total_users: number;
  total_admins: number;
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get<DashboardData>("/dashboard/");
      
      set({
        data: response,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      
      set({
        loading: false,
        error: err.message || "Failed to load dashboard data. Please check if backend is running.",
        data: null,
      });
    }
  },

  reset: () => set({ data: null, loading: false, error: null }),
}));