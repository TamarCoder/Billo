import { useState } from "react";
import { Card } from "@/components/Card/Card";
import { InvoiceFormList } from "@/components/InvoiceFormList/InvoiceFormList";
import { invoiceFormsApi } from "@/api/invoiceForms";
import { useInvoiceForms } from "@/hooks/api/useInvoiceForms";
import styles from "./page.module.scss";

export default function FormsPage() {
  const { data: forms, error: loadError } = useInvoiceForms();
  const [error, setError] = useState("");
  const message =
    error || (loadError ? "ფორმების ჩატვირთვა ვერ მოხერხდა." : "");

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <span aria-current="page">ინვოისის ფორმები</span>
      </nav>
      <Card heading="ინვოისის ფორმები" description="Billo-ს მიერ თქვენთვის ატვირთული ფაილები.">
        {message && (
          <p className={styles.error} role="alert">
            {message}
          </p>
        )}
        {!forms && !loadError ? (
          <p className={styles.loading} role="status">ფორმები იტვირთება…</p>
        ) : (
          <InvoiceFormList
            forms={forms ?? []}
            download={(form) => invoiceFormsApi.download(form.id)}
            onError={setError}
          />
        )}
      </Card>
    </main>
  );
}
