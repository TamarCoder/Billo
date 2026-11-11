import { getSessionToken, requireSession } from "@/lib/session";

// Base URL of Billo--Backend. Set VITE_API_URL in .env.local.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message = `Request failed with status ${status}`,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const sessionToken = getSessionToken();
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (sessionToken) headers.set("Authorization", `Bearer ${sessionToken}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const baseUrl = API_URL.replace(/\/+$/u, "");
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...init,
    headers,
  });
  const responseText = res.status === 204 ? "" : await res.text();
  let body: unknown = null;

  if (responseText) {
    try {
      body = JSON.parse(responseText) as unknown;
    } catch {
      if (res.ok) {
        throw new ApiError(
          res.status,
          responseText,
          "The API returned an invalid JSON response.",
        );
      }
      body = responseText;
    }
  }

  if (res.status === 401) requireSession();
  if (!res.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, body, message);
  }
  if (res.status !== 204 && body === null) {
    throw new ApiError(res.status, body, "The API returned an empty response.");
  }

  return body as T;
}

// Authenticated file download (the response is a file, not JSON).
export async function fetchBlob(path: string): Promise<Blob> {
  const sessionToken = getSessionToken();
  const headers = new Headers();
  if (sessionToken) headers.set("Authorization", `Bearer ${sessionToken}`);
  const res = await fetch(`${API_URL.replace(/\/+$/u, "")}${path}`, { headers });
  if (res.status === 401) requireSession();
  if (!res.ok) throw new ApiError(res.status, null, "ფაილის ჩამოტვირთვა ვერ მოხერხდა.");
  return res.blob();
}
