import { Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./ContactsPanel.module.scss";

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const CONTACTS: { icon: ReactNode; label: string; value: string; href: string; external?: boolean }[] = [
  {
    icon: <Mail size={18} aria-hidden />,
    label: "ელ. ფოსტა",
    value: "thamuna.khuskivadze@gmail.com",
    href: "mailto:thamuna.khuskivadze@gmail.com",
  },
  {
    icon: <Phone size={18} aria-hidden />,
    label: "ტელეფონი",
    value: "+995 558 56 59 31",
    href: "tel:+995558565931",
  },
  {
    icon: <LinkedInIcon />,
    label: "LinkedIn",
    value: "linkedin.com/in/tamarkhuskivadze",
    href: "https://www.linkedin.com/in/tamarkhuskivadze",
    external: true,
  },
];

export function ContactsPanel() {
  return (
    <div className={styles.contacts}>
      <p className={styles.lead}>
        კითხვა, იდეა ან თანამშრომლობის შეთავაზება გაქვთ? დამიკავშირდით ნებისმიერი გზით.
      </p>
      <ul className={styles.list}>
        {CONTACTS.map(({ icon, label, value, href, external }) => (
          <li key={label}>
            <a
              className={styles.item}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <span className={styles.icon}>{icon}</span>
              <span className={styles.text}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
