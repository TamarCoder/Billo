import { Building2, History, Home, Settings } from "lucide-react";
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
      </nav>
      <ThemeToggle className={styles.themeToggle} />
    </aside>
  );
}
