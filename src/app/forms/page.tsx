import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { InvoiceFormList } from "@/components/InvoiceFormList/InvoiceFormList";
import { invoiceFormsApi } from "@/api/invoiceForms";
import { useAccount } from "@/hooks/api/useAccount";
import { useInvoiceForms } from "@/hooks/api/useInvoiceForms";
import { INVOICE_TEMPLATES, templatesFor } from "@/invoiceTemplates/registry";
import styles from "./page.module.scss";

export default function FormsPage() {
  const { data: account, error: accountError } = useAccount();
  const { data: forms, error: loadError } = useInvoiceForms();
  const [error, setError] = useState("");
  const message = error || (loadError ? "ფაილების ჩატვირთვა ვერ მოხერხდა." : "");

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <span aria-current="page">ინვოისის ფორმები</span>
      </nav>

      <Card heading="ჩემი ფორმები" description="თქვენთვის მომზადებული ინვოისის ფორმები.">
        {!account && !accountError ? (
          <p className={styles.loading} role="status">ფორმები იტვირთება…</p>
        ) : templatesFor(account?.invoiceTemplates).length === 0 ? (
          <p className={styles.loading}>ფორმები ჯერ არ არის.</p>
        ) : (
          <ul className={styles.templates}>
            {templatesFor(account?.invoiceTemplates).map((key) => (
              <li key={key}>
                <Link className={styles.template} to={`/forms/${key}`}>
                  <FileText size={20} aria-hidden className={styles.templateIcon} />
                  <span className={styles.templateName}>{INVOICE_TEMPLATES[key].title}</span>
                  <ChevronRight size={18} aria-hidden className={styles.templateArrow} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card heading="ატვირთული ფაილები" description="Billo-ს მიერ თქვენთვის ატვირთული ფაილები.">
        {message && (
          <p className={styles.error} role="alert">
            {message}
          </p>
        )}
        {!forms && !loadError ? (
          <p className={styles.loading} role="status">ფაილები იტვირთება…</p>
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
