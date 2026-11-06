"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { KeyRound } from "lucide-react";
import {
  API_KEY_HEADER,
  API_KEY_REQUIRED_EVENT,
  getApiKey,
  saveApiKey,
} from "@/lib/apiKey";
import { API_URL } from "@/lib/fetcher";
import { Button } from "@/ui/Button/Button";
import { Input } from "@/ui/Input/Input";
import styles from "./ApiKeyGate.module.scss";

// Shows a one-time "enter API key" screen until a valid key is saved on this
// device. If the API later answers 401, the screen appears again.
export function ApiKeyGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => getApiKey() !== null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const lock = () => setUnlocked(false);
    window.addEventListener(API_KEY_REQUIRED_EVENT, lock);
    return () => window.removeEventListener(API_KEY_REQUIRED_EVENT, lock);
  }, []);

  if (unlocked) return <>{children}</>;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = value.trim();
    if (!key) return;

    setChecking(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL.replace(/\/+$/u, "")}/api/companies`,
        { headers: { Accept: "application/json", [API_KEY_HEADER]: key } },
      );
      if (response.status === 401) {
        setError("გასაღები არასწორია.");
        return;
      }
      if (!response.ok) {
        setError(`სერვერმა შეცდომა დააბრუნა (${response.status}).`);
        return;
      }
      saveApiKey(key);
      setValue("");
      setUnlocked(true);
    } catch {
      setError("სერვერთან კავშირი ვერ დამყარდა. სცადე ცოტა ხანში.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className={styles.screen}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <span className={styles.icon} aria-hidden="true">
          <KeyRound size={22} />
        </span>
        <h1 className={styles.title}>Billo-ში შესვლა</h1>
        <p className={styles.hint}>
          შეიყვანე API გასაღები. ამ მოწყობილობაზე მხოლოდ ერთხელ დაგჭირდება.
        </p>
        <label className={styles.label} htmlFor="billo-api-key">
          API გასაღები
        </label>
        <Input
          id="billo-api-key"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          status={error ? "error" : "default"}
        />
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth loading={checking} disabled={!value.trim()}>
          შესვლა
        </Button>
      </form>
    </main>
  );
}
