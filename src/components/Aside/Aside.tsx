import { useState } from "react";
import { Building2, FileText, History, Home, LogOut, RefreshCw, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { authApi } from "@/api/auth";
import { useIssuers } from "@/hooks/api/useIssuers";
import { clearAccountData } from "@/lib/session";
import { AsideButton } from "@/ui/AsideButton/AsideButton";
import { ThemeToggle } from "@/ui/ThemeToggle/ThemeToggle";
import styles from "./Aside.module.scss";

const homeItem = { to: "/home", title: "მთავარი", icon: <Home size={20} /> };

const navigationItems = [
  { to: "/companies", title: "კომპანიები", icon: <Building2 size={20} /> },
  { to: "/history", title: "ისტორია", icon: <History size={20} /> },
];

export function Aside() {
  const { mutate } = useSWRConfig();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { data: issuers } = useIssuers();
  const primaryIssuer = issuers?.find((issuer) => issuer.isPrimary) ?? issuers?.[0];

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // The local session is cleared anyway; an expired token needs no server call.
    }
    clearAccountData();
    await mutate(() => true, undefined, { revalidate: false });
    setIsLoggingOut(false);
    navigate("/login", { replace: true });
  };

  // Full reload: picks up a newly deployed frontend as well as fresh data.
  const refreshData = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src="/icon.png" alt="" width={32} height={32} />
        <span>BILLO</span>
        <button
          type="button"
          className={`${styles.refreshButton} ${styles.brandRefresh} ${isRefreshing ? styles.refreshing : ""}`}
          title="განახლება"
          onClick={refreshData}
          disabled={isRefreshing}
          aria-busy={isRefreshing}
        >
          <RefreshCw className={styles.refreshIcon} size={20} aria-hidden="true" />
          <span>{isRefreshing ? "მიმდინარეობს განახლება..." : "განახლება"}</span>
        </button>
      </div>

      <nav className={styles.navigation} aria-label="მთავარი ნავიგაცია">
        <AsideButton {...homeItem} className={styles.link} />
        <AsideButton
          to={primaryIssuer ? `/invoice/${primaryIssuer.id}` : "/invoice"}
          title="ინვოისის ფორმა"
          activePrefix="/invoice"
          icon={<FileText size={20} />}
          className={styles.link}
        />
        {navigationItems.map(({ to, title, icon }) => (
          <AsideButton
            key={to}
            to={to}
            title={title}
            icon={icon}
            className={styles.link}
          />
        ))}
      </nav>
      <div className={styles.footer}>
        <AsideButton
          to="/settings"
          title="პარამეტრები"
          icon={<Settings size={20} />}
          className={styles.footerButton}
        />
        <ThemeToggle className={styles.footerButton} />
        <button
          type="button"
          className={`${styles.logoutButton} ${styles.footerButton}`}
          title="გამოსვლა"
          onClick={() => void logout()}
          disabled={isLoggingOut}
          aria-busy={isLoggingOut}
        >
          <LogOut className={styles.refreshIcon} size={20} aria-hidden="true" />
          <span>{isLoggingOut ? "გამოსვლა..." : "გამოსვლა"}</span>
        </button>
      </div>
    </aside>
  );
}
