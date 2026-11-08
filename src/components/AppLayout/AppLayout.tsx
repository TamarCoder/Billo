import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { Aside } from "@/components/Aside/Aside";
import { getSessionToken, requireSession, SESSION_REQUIRED_EVENT } from "@/lib/session";
import styles from "./AppLayout.module.scss";

const PUBLIC_PATHS = new Set(["/", "/login", "/register", "/forgot-password"]);

export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mutate } = useSWRConfig();

  // An expired session must not leave the previous account's data in the cache.
  useEffect(() => {
    const toLogin = () => {
      void mutate(() => true, undefined, { revalidate: false });
      navigate("/login", { replace: true });
    };
    window.addEventListener(SESSION_REQUIRED_EVENT, toLogin);
    return () => window.removeEventListener(SESSION_REQUIRED_EVENT, toLogin);
  }, [mutate, navigate]);

  // A session that ran out sends no request (keys are null), so check it on every page change.
  useEffect(() => {
    if (!PUBLIC_PATHS.has(pathname) && !getSessionToken()) requireSession();
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <Aside />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
