import { useAuthStore } from "@/store/authStore";

// --- Configuration ---
export const BASE_URL = "http://localhost:8000";

type Options = RequestInit & {
  params?: Record<string, string | number>;
};

// --- 1. Refresh Token Logic ---
async function refreshAccessToken(): Promise<boolean> {
  try {
    const auth = useAuthStore.getState();
    
    if (!auth.refreshToken) {
      auth.logout();
      return false;
    }

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: auth.refreshToken }),
    });

    if (!response.ok) {
      auth.logout();
      return false;
    }

    const data = await response.json();
    
    // We need the current user to update tokens correctly
    const currentUser = auth.user;
    if (!currentUser) {
      auth.logout();
      return false;
    }

    auth.setTokens(data.access_token, data.refresh_token, currentUser);
    return true;
  } catch (error) {
    useAuthStore.getState().logout();
    return false;
  }
}

// --- 2. Main Request Helper ---
async function request<T>(path: string, options: Options = {}): Promise<T> {
  const { params, headers, ...rest } = options;
  const url = new URL(path, BASE_URL);

  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }

  let token = useAuthStore.getState().accessToken;

  // Helper to perform the actual fetch
  const makeRequest = () =>
    fetch(url.toString(), {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
    });

  let res = await makeRequest();

  // --- 3. Handle 401 Unauthorized (Refresh Token) ---
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    
    if (!refreshed) {
      // If refresh fails, redirect to login
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    // Retry request with new token
    token = useAuthStore.getState().accessToken;
    res = await makeRequest();
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || res.statusText);
  }

  return res.json();
}

// --- 4. Exports ---
export const api = {
  get: <T>(path: string, options?: Options) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Options) => // <--- FIXED: Changed "service/body" to "string"
    request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: Options) => request<T>(path, { ...options, method: "DELETE" }),
};