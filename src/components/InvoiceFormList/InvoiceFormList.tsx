import { useState } from "react";
import { Download, FileText, Trash2 } from "lucide-react";
import { IconButton } from "@/ui/IconButton/IconButton";
import { saveBlob } from "@/lib/saveBlob";
import type { InvoiceFormFile } from "@/types/api";
import styles from "./InvoiceFormList.module.scss";

export interface InvoiceFormListProps {
  forms: InvoiceFormFile[];
  download: (form: InvoiceFormFile) => Promise<Blob>;
  onDelete?: (form: InvoiceFormFile) => void;
  onError: (message: string) => void;
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function InvoiceFormList({ forms, download, onDelete, onError }: InvoiceFormListProps) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const downloadForm = async (form: InvoiceFormFile) => {
    setBusyId(form.id);
    try {
      saveBlob(await download(form), form.fileName);
    } catch (error) {
      onError(error instanceof Error ? error.message : "ფაილის ჩამოტვირთვა ვერ მოხერხდა.");
    } finally {
      setBusyId(null);
    }
  };

  if (forms.length === 0) {
    return <p className={styles.empty}>ფორმები ჯერ არ არის ატვირთული.</p>;
  }

  return (
    <ul className={styles.list}>
      {forms.map((form) => (
        <li key={form.id} className={styles.item}>
          <FileText size={20} className={styles.icon} aria-hidden="true" />
          <span className={styles.name} title={form.fileName}>{form.fileName}</span>
          <span className={styles.meta}>
            {formatSize(form.size)} · {new Date(form.createdAt).toLocaleDateString("ka-GE")}
          </span>
          <span className={styles.actions}>
            <IconButton
              aria-label="ჩამოტვირთვა"
              icon={<Download size={18} />}
              onClick={() => void downloadForm(form)}
              disabled={busyId === form.id}
            />
            {onDelete && (
              <IconButton aria-label="წაშლა" variant="danger" icon={<Trash2 size={18} />} onClick={() => onDelete(form)} />
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
