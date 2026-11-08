const STORAGE_KEY = "billo-session";

export const SESSION_REQUIRED_EVENT = "billo:session-required";

interface StoredSession {
  token: string;
  expiresAt: string;
}

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredSession;
    if (new Date(session.expiresAt).getTime() <= Date.now()) return null;
    return session.token;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable; nothing to clear.
  }
}

export function requireSession(): void {
  if (typeof window === "undefined") return;
  clearSession();
  window.dispatchEvent(new Event(SESSION_REQUIRED_EVENT));
}
