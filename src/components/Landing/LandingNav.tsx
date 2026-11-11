import { Button } from "@/ui/Button/Button";
import styles from "./Landing.module.scss";

export type LandingPanel = "about" | "contacts";

interface LandingNavProps {
  onOpen: (panel: LandingPanel) => void;
}

export function LandingNav({ onOpen }: LandingNavProps) {
  return (
    <header className={styles.nav}>
      <img className={styles.brand} src="/logo-horizontal.svg" alt="Billo" />
      <nav className={styles.menu} aria-label="მენიუ">
        <Button variant="glass" aria-current="page">
          მთავარი
        </Button>
        <Button variant="ghost" onClick={() => onOpen("about")}>
          პროექტის შესახებ
        </Button>
        <Button variant="ghost" onClick={() => onOpen("contacts")}>
          კონტაქტები
        </Button>
      </nav>
    </header>
  );
}
