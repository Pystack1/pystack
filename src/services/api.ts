import { useAuthStore } from "@/store/authStore";

export const BASE_URL = "http://localhost:8000";

type Options = RequestInit & {
  params?: Record<string, string | number>;
};

async function refreshAccessToken(): Promise<boolean> {
  try {
    const auth = useAuthStore.getState();
    if (!auth.refreshToken) { auth.logout(); return false; }

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: auth.refreshToken }),
    });

    if (!response.ok) { auth.logout(); return false; }

    const data = await response.json();
    const currentUser = auth.user;
    if (!currentUser) { auth.logout(); return false; }

    auth.setTokens(data.access_token, data.refresh_token, currentUser);
    return true;
  } catch (error) {
    useAuthStore.getState().logout();
    return false;
  }
}

async function request<T>(path: string, options: Options = {}): Promise<T> {
  const { params, headers, ...rest } = options;
  const url = new URL(path, BASE_URL);

  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }

  let token = useAuthStore.getState().accessToken;

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

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    token = useAuthStore.getState().accessToken;
    res = await makeRequest();
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || res.statusText);
  }

  return res.json();
}

// NEW: Dedicated upload function for FormData
async function upload<T>(path: string, formData: FormData): Promise<T> {
  const url = new URL(path, BASE_URL);
  let token = useAuthStore.getState().accessToken;

  // DEBUG: Log token to verify it's not null
  console.log("Upload token:", token ? "present" : "MISSING");

  const makeRequest = () =>
    fetch(url.toString(), {
      method: "POST",
      body: formData,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // NO Content-Type — browser sets multipart boundary automatically
      },
    });

  let res = await makeRequest();

  if (res.status === 401) {
    console.log("Upload 401, attempting refresh...");
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    token = useAuthStore.getState().accessToken;
    console.log("Upload token after refresh:", token ? "present" : "MISSING");
    res = await makeRequest();
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || res.statusText);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string, options?: Options) => 
    request<T>(path, { ...options, method: "GET" }),
  
  post: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  
  put: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  
  delete: <T>(path: string, options?: Options) => 
    request<T>(path, { ...options, method: "DELETE" }),
  
  // Use this for file uploads
  upload: <T>(path: string, formData: FormData) => upload<T>(path, formData),
};