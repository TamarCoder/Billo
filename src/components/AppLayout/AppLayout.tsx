import type { ReactNode } from "react";
import { Aside } from "@/components/Aside/Aside";
import styles from "./AppLayout.module.scss";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Aside />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
