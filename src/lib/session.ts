import { INVOICE_EDIT_ID_KEY } from "@/lib/invoiceStorage";

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

// Session plus per-account data kept on this device.
export function clearAccountData(): void {
  clearSession();
  try {
    window.localStorage.removeItem(INVOICE_EDIT_ID_KEY);
  } catch {
    // Storage can be unavailable; nothing to clear.
  }
}

export function requireSession(): void {
  if (typeof window === "undefined") return;
  clearAccountData();
  window.dispatchEvent(new Event(SESSION_REQUIRED_EVENT));
}
