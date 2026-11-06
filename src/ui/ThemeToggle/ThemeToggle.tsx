import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import styles from "./ThemeToggle.module.scss";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const buttonClassName = [styles.button, className].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={toggleTheme}
      aria-label={isDark ? "ღია რეჟიმზე გადართვა" : "მუქ რეჟიმზე გადართვა"}
      title={isDark ? "ღია რეჟიმზე გადართვა" : "მუქ რეჟიმზე გადართვა"}
    >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </span>
      <span>{isDark ? "მუქი რეჟიმი" : "ღია რეჟიმი"}</span>
    </button>
  );
}
