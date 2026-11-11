import styles from "./Starfield.module.scss";

// Decorative night-sky background: gradient, dots and a few sparkles.
export function Starfield() {
  return (
    <div className={styles.sky} aria-hidden="true">
      <span className={`${styles.sparkle} ${styles.s1}`} />
      <span className={`${styles.sparkle} ${styles.s2}`} />
      <span className={`${styles.sparkle} ${styles.s3}`} />
      <span className={`${styles.sparkle} ${styles.s4}`} />
    </div>
  );
}
