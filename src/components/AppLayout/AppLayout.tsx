import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Aside } from "@/components/Aside/Aside";
import { SESSION_REQUIRED_EVENT } from "@/lib/session";
import styles from "./AppLayout.module.scss";

export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const toLogin = () => navigate("/login", { replace: true });
    window.addEventListener(SESSION_REQUIRED_EVENT, toLogin);
    return () => window.removeEventListener(SESSION_REQUIRED_EVENT, toLogin);
  }, [navigate]);

  return (
    <div className={styles.shell}>
      <Aside />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
