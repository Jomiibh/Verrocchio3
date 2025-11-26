const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const TOKEN_KEY = "verrocchio_auth_token";

export function saveAuthToken(token: string | null) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const error = (data && (data.error || data.message)) || res.statusText;
    throw new Error(error);
  }

  return data;
}

export async function loginApi(emailOrUsername: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ emailOrUsername, password }),
  });
}

export async function registerApi(input: {
  email: string;
  username: string;
  password: string;
  display_name: string;
  role: "artist" | "buyer";
  avatar_url?: string | null;
}) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function meApi() {
  return apiFetch("/auth/me", { method: "GET" });
}
