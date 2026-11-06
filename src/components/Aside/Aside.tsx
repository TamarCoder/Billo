import { useState } from "react";
import { Building2, History, Home, RefreshCw, Settings } from "lucide-react";
import { useSWRConfig } from "swr";
import { AsideButton } from "@/ui/AsideButton/AsideButton";
import { ThemeToggle } from "@/ui/ThemeToggle/ThemeToggle";
import styles from "./Aside.module.scss";

const navigationItems = [
  { to: "/home", title: "მთავარი", icon: <Home size={20} /> },
  { to: "/companies", title: "კომპანიები", icon: <Building2 size={20} /> },
  { to: "/history", title: "ისტორია", icon: <History size={20} /> },
  { to: "/settings", title: "პარამეტრები", icon: <Settings size={20} /> },
];

export function Aside() {
  const { mutate } = useSWRConfig();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");

  const refreshData = async () => {
    setIsRefreshing(true);
    setRefreshError("");
    try {
      await mutate((key) => typeof key === "string");
    } catch {
      setRefreshError("მონაცემების განახლება ვერ მოხერხდა.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src="/icon.png" alt="" width={32} height={32} />
        <span>BILLO</span>
      </div>

      <nav className={styles.navigation} aria-label="მთავარი ნავიგაცია">
        {navigationItems.map(({ to, title, icon }) => (
          <AsideButton
            key={to}
            to={to}
            title={title}
            icon={icon}
            className={styles.link}
          />
        ))}
        <button
          type="button"
          className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ""}`}
          onClick={() => void refreshData()}
          disabled={isRefreshing}
          aria-busy={isRefreshing}
        >
          <RefreshCw className={styles.refreshIcon} size={20} aria-hidden="true" />
          <span>{isRefreshing ? "მიმდინარეობს განახლება..." : "განახლება"}</span>
        </button>
        {refreshError && (
          <p className={styles.refreshError} role="alert">
            {refreshError}
          </p>
        )}
      </nav>
      <ThemeToggle className={styles.themeToggle} />
    </aside>
  );
}
