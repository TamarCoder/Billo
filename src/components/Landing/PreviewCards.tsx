import { Eye, Lock, User } from "lucide-react";
import styles from "./Landing.module.scss";

// Static, non-interactive copies of the real app screens, used as decoration.
const ACCOUNT_ROWS = [
  ["კომპანიები", "12"],
  ["ინვოისები", "73"],
  ["გაგზავნილი", "58"],
  ["დაბეჭდილი", "9"],
  ["მონახაზი", "6"],
];

const HISTORY_ROWS = [
  ["ინვოისი №0142", "გაგზავნილი", "1,250.00"],
  ["ინვოისი №0141", "დაბეჭდილი", "860.00"],
  ["ინვოისი №0140", "გაგზავნილი", "2,400.00"],
  ["ინვოისი №0139", "მონახაზი", "315.50"],
  ["ინვოისი №0138", "გაგზავნილი", "1,120.00"],
  ["ინვოისი №0137", "გაგზავნილი", "740.00"],
];

export function LoginPreview() {
  return (
    <div className={`${styles.card} ${styles.login}`}>
      <p className={styles.cardTitle}>შესვლა</p>
      <span className={styles.field}><User size={14} /> საიდენტიფიკაციო კოდი</span>
      <span className={styles.field}><Lock size={14} /> ••••••••<Eye size={14} /></span>
      <span className={styles.fakeButton}>შესვლა</span>
      <span className={styles.cardHint}>დაგავიწყდა პაროლი?</span>
    </div>
  );
}

export function AccountPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.card} ${className}`}>
      <p className={styles.cardBrand}>BILLO</p>
      <p className={styles.cardTitle}>ანგარიშის მონაცემები</p>
      <div className={styles.rows}>
        {ACCOUNT_ROWS.map(([label, value]) => (
          <span key={label} className={styles.row}><span>{label}</span><span>{value}</span></span>
        ))}
      </div>
      <span className={styles.row}><span>ჯამი</span><span>20,410.00 ₾</span></span>
      <span className={styles.fakeButton}>ახალი ინვოისი</span>
    </div>
  );
}

export function HistoryPreview() {
  return (
    <div className={`${styles.card} ${styles.history}`}>
      <p className={styles.cardBrand}>BILLO</p>
      <p className={styles.cardTitle}>ინვოისების ისტორია</p>
      <div className={styles.rows}>
        <span className={`${styles.row} ${styles.head}`}><span>ინვოისი</span><span>სტატუსი</span><span>თანხა</span></span>
        {HISTORY_ROWS.map(([name, status, amount]) => (
          <span key={name} className={styles.row}><span>{name}</span><span>{status}</span><span>{amount}</span></span>
        ))}
      </div>
    </div>
  );
}
