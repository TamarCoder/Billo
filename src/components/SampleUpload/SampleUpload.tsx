import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useSWRConfig } from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { invoiceFormsApi } from "@/api/invoiceForms";
import { Button } from "@/ui/Button/Button";
import styles from "./SampleUpload.module.scss";

// Same limits as the backend: PDF, Word, Excel, PNG or JPEG, up to 5 MB.
const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg";
const MAX_BYTES = 5 * 1024 * 1024;

// The organization sends Billo a sample of the invoice it uses today.
export function SampleUpload() {
  const { mutate } = useSWRConfig();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);

  const send = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setMessage({ text: "ფაილი 5 MB-ზე დიდია.", error: true });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await invoiceFormsApi.upload(file);
      await mutate(API_ENDPOINTS.invoiceForms);
      setMessage({ text: "ნიმუში გაიგზავნა.", error: false });
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "გაგზავნა ვერ მოხერხდა.",
        error: true,
      });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className={styles.upload}>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(event) => void send(event.target.files?.[0])}
      />
      <Button
        variant="primary"
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        <Upload size={18} aria-hidden />{" "}
        {busy ? "იგზავნება…" : "ნიმუშის გაგზავნა"}
      </Button>
      <p className={styles.hint}>PDF, Word, Excel ან სურათი, მაქს. 5 MB.</p>
      {message && (
        <p
          className={message.error ? styles.error : styles.ok}
          role={message.error ? "alert" : "status"}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
