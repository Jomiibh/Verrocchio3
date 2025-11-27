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

export async function getProfile() {
  return apiFetch("/users/me", { method: "GET" });
}

export async function updateProfile(input: {
  display_name?: string;
  bio?: string;
  avatar_url?: string | null;
  banner_url?: string | null;
  social_links?: {
    twitter?: string;
    instagram?: string;
    discord?: string;
    other?: string;
  };
  slides?: any[];
  artStyles?: string[];
  priceMin?: number;
  priceMax?: number;
}) {
  return apiFetch("/users/me", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function getPosts() {
  return apiFetch("/posts", { method: "GET" });
}

export async function createPost(input: { body: string; imageUrls: string[] }) {
  return apiFetch("/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getArtists(search?: string) {
  const qs = search ? `?q=${encodeURIComponent(search)}` : "";
  return apiFetch(`/users/artists${qs}`, { method: "GET" });
}

// Commission requests
export async function getRequests() {
  return apiFetch("/requests", { method: "GET" });
}

export async function getMyRequests() {
  return apiFetch("/requests/mine", { method: "GET" });
}

export async function createRequest(input: {
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  timeframe?: string;
  tags?: string[];
  sample_image_urls?: string[];
  status?: string;
}) {
  return apiFetch("/requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateRequest(id: string, input: Partial<{
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  timeframe: string;
  tags: string[];
  sample_image_urls: string[];
  status: string;
}>) {
  return apiFetch(`/requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteRequest(id: string) {
  return apiFetch(`/requests/${id}`, { method: "DELETE" });
}

// Conversations & messages
export async function getConversations() {
  return apiFetch("/conversations", { method: "GET" });
}

export async function createConversation(participantId: string) {
  return apiFetch("/conversations", {
    method: "POST",
    body: JSON.stringify({ participantId }),
  });
}

export async function getMessages(conversationId: string) {
  return apiFetch(`/conversations/${conversationId}/messages`, { method: "GET" });
}

export async function sendMessage(conversationId: string, content: string) {
  return apiFetch(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
