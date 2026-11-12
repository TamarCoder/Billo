import { Clock, FileText, Monitor } from "lucide-react";
import styles from "./AboutPanel.module.scss";

const FEATURES = [
  { icon: FileText, title: "ერთ ადგილას", text: "გამომწერები, კლიენტები და შაბლონები" },
  { icon: Clock, title: "წამებში", text: "ახალი ინვოისი და ისტორია თვეების მიხედვით" },
  { icon: Monitor, title: "ყველგან", text: "ბრაუზერი, macOS და Windows" },
];

export function AboutPanel() {
  return (
    <div className={styles.about}>
      <p className={styles.lead}>
        Billo იმიტომ შევქმენი, რომ ყოველთვიური ინვოისების ხელით შედგენა დიდ დროს მოითხოვდა. ერთი და
        იგივე მონაცემები ყოველ ჯერზე თავიდან იწერებოდა და შეცდომის რისკი დიდი იყო.
      </p>

      <ul className={styles.features}>
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title} className={styles.feature}>
            <span className={styles.featureIcon}>
              <Icon size={18} aria-hidden />
            </span>
            <strong>{title}</strong>
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <div className={styles.openSource}>
        <p>
          პროექტი <strong>ღია კოდისაა</strong> (open source). ნებისმიერს შეუძლია მისი ნახვა,
          გამოყენება და განვითარება.
        </p>
        <a
          className={styles.github}
          href="https://github.com/TamarCoder/Billo"
          target="_blank"
          rel="noreferrer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
      </div>
    </div>
  );
}
