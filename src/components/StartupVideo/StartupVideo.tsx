import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionToken } from "@/lib/session";
import styles from "./StartupVideo.module.scss";

export function StartupVideo() {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const enterApp = () =>
    navigate(getSessionToken() ? "/home" : "/login", { replace: true });

  if (hasError) {
    return (
      <main className={styles.splash}>
        <p className={styles.error} role="alert">
          ვიდეოს ჩატვირთვა ვერ მოხერხდა.
        </p>
        <button
          className={styles.continueButton}
          type="button"
          onClick={() => enterApp()}
        >
          აპლიკაციაში გადასვლა
        </button>
      </main>
    );
  }

  return (
    <main className={styles.splash}>
      <video
        className={styles.video}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => enterApp()}
        onError={() => setHasError(true)}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </main>
  );
}
