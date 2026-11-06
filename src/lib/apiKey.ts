// The API key is stored only on this device (localStorage) and is never part
// of the build, so it can't be read from the public Vercel bundle.
const STORAGE_KEY = "billo-api-key";

export const API_KEY_HEADER = "X-API-Key";
export const API_KEY_REQUIRED_EVENT = "billo:api-key-required";

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveApiKey(key: string): void {
  window.localStorage.setItem(STORAGE_KEY, key);
}

export function apiKeyHeaders(): Record<string, string> {
  const key = getApiKey();
  return key ? { [API_KEY_HEADER]: key } : {};
}

// Called when the API answers 401: forget the stored key and ask for it again.
export function requireApiKey(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable; the gate will still be shown.
  }
  window.dispatchEvent(new Event(API_KEY_REQUIRED_EVENT));
}
