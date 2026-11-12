import { useEffect, useState } from "react";
import styles from "./FilePreview.module.scss";

// Shows an uploaded PDF or image inside the page. Other types can only be downloaded.
export function FilePreview({
  load,
  mimeType,
  fileName,
}: {
  load: () => Promise<Blob>;
  mimeType: string;
  fileName: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    setUrl(null);
    setError("");
    load()
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => !cancelled && setError("ფაილის ჩატვირთვა ვერ მოხერხდა."));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [load]);

  if (error) return <p className={styles.message} role="alert">{error}</p>;
  if (!url) return <p className={styles.message} role="status">ფაილი იტვირთება…</p>;
  if (mimeType === "application/pdf") {
    return <iframe className={styles.frame} src={url} title={fileName} />;
  }
  if (mimeType.startsWith("image/")) {
    return <img className={styles.image} src={url} alt={fileName} />;
  }
  return (
    <p className={styles.message}>
      ამ ტიპის ფაილის ნახვა აქ შეუძლებელია.{" "}
      <a href={url} download={fileName}>ჩამოტვირთეთ</a>
    </p>
  );
}
