import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/services/api";

// --- Types ---
interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface User {
  id: number;
  email: string;
  full_name?: string;
  roles: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string, user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      login: async (email, password) => {
        try {
          // 1. Call Login API
          // api.post returns the data directly, so we name it 'loginData', not 'response'
          const loginData = await api.post<LoginResponse>("/auth/login", { email, password });

          // 2. Fetch User Info manually using the new token
          // We use raw fetch here to avoid circular dependency / hydration timing issues
          const userResponse = await fetch("http://localhost:8000/auth/me", {
            headers: { Authorization: `Bearer ${loginData.access_token}` }
          });

          if (!userResponse.ok) throw new Error("Failed to fetch user profile");
          const userData = await userResponse.json();

          // 3. Update State
          set({
            isAuthenticated: true,
            accessToken: loginData.access_token, // <--- REMOVED .data
            refreshToken: loginData.refresh_token, // <--- REMOVED .data
            user: userData,
          });

          return { ok: true };
        } catch (err: any) {
          console.error("Login error:", err);
          return {
            ok: false,
            error: err.message || "Login failed",
          };
        }
      },

      register: async (email, password) => {
        try {
          await api.post("/auth/register", { email, password });
          return { ok: true };
        } catch (err: any) {
          return {
            ok: false,
            error: err.response?.data?.detail || "Registration failed",
          };
        }
      },

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        }),

      setTokens: (accessToken, refreshToken, user) =>
        set({ isAuthenticated: true, accessToken, refreshToken, user }),
    }),
    {
      name: "pystack-auth",
    }
  )
);