import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { invoiceFormsApi } from "@/api/invoiceForms";
import { FilePreview } from "@/components/FilePreview/FilePreview";
import { FormStatusBadge } from "@/components/FormStatusBadge/FormStatusBadge";
import { TemplatePreview } from "@/components/TemplatePreview/TemplatePreview";
import { INVOICE_TEMPLATES } from "@/invoiceTemplates/registry";
import type { InvoiceFormFile } from "@/types/api";
import { Button } from "@/ui/Button/Button";
import styles from "./FileReview.module.scss";

// One sample the organization sent. When Billo has built its form, the organization checks it here
// and approves it or asks for changes.
export function FileReview({ form }: { form: InvoiceFormFile }) {
  const { mutate } = useSWRConfig();
  const [mode, setMode] = useState<"idle" | "changes">("idle");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const status = form.status ?? "submitted";
  const canReview =
    status === "review" &&
    !!form.templateKey &&
    form.templateKey in INVOICE_TEMPLATES;
  const load = useCallback(() => invoiceFormsApi.download(form.id), [form.id]);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await action();
      await mutate(API_ENDPOINTS.invoiceForms);
      setMode("idle");
      setComment("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "მოქმედება ვერ შესრულდა. სცადეთ ხელახლა.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.review}>
      <header className={styles.header}>
        <span className={styles.name} title={form.fileName}>
          {form.fileName}
        </span>
        <FormStatusBadge status={status} />
      </header>

      {status === "changes_requested" && form.reviewComment && (
        <p className={styles.note}>თქვენი კომენტარი: {form.reviewComment}</p>
      )}
      {status === "submitted" && (
        <p className={styles.note}>
          ნიმუში მიღებულია. Billo მალე დაიწყებს თქვენი ფორმის აწყობას.
        </p>
      )}
      {status === "in_progress" && (
        <p className={styles.note}>თქვენი ფორმა მზადდება.</p>
      )}
      {status === "review" && (
        <p className={styles.note}>
          ფორმა მზადაა. შეამოწმეთ ქვემოთ: ყველაფერი სწორია?
        </p>
      )}
      {status === "approved" && (
        <p className={styles.note}>
          დადასტურებულია. ფორმა "ჩემ ფორმებში" გამოჩნდება, როცა Billo მას
          გაუშვებს.
        </p>
      )}
      {status === "live" && (
        <p className={styles.note}>ფორმა აქტიურია და "ჩემ ფორმებშია".</p>
      )}

      {canReview && mode === "idle" && (
        <div className={styles.actions}>
          <Button
            variant="success"
            disabled={busy}
            onClick={() => void run(() => invoiceFormsApi.approve(form.id))}
          >
            ვეთანხმები
          </Button>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => setMode("changes")}
          >
            შესწორება სჭირდება
          </Button>
        </div>
      )}

      {canReview && mode === "changes" && (
        <form
          className={styles.changes}
          onSubmit={(event) => {
            event.preventDefault();
            void run(() =>
              invoiceFormsApi.requestChanges(form.id, comment.trim()),
            );
          }}
        >
          <label htmlFor="review-comment">რა უნდა შესწორდეს?</label>
          <textarea
            id="review-comment"
            className={styles.textarea}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={1000}
            rows={4}
            required
          />
          <div className={styles.actions}>
            <Button
              type="submit"
              variant="danger"
              disabled={busy || !comment.trim()}
            >
              გაგზავნა
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => setMode("idle")}
            >
              გაუქმება
            </Button>
          </div>
        </form>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {canReview && form.templateKey && (
        <section className={styles.section} aria-label="აწყობილი ფორმა">
          <h3 className={styles.sectionTitle}>აწყობილი ფორმა</h3>
          <TemplatePreview templateKey={form.templateKey} />
        </section>
      )}

      <section className={styles.section} aria-label="თქვენი ნიმუში">
        <h3 className={styles.sectionTitle}>თქვენი ნიმუში</h3>
        <FilePreview
          load={load}
          mimeType={form.mimeType}
          fileName={form.fileName}
        />
      </section>
    </div>
  );
}
