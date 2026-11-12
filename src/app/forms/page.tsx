import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { TemplatePreview } from "@/components/TemplatePreview/TemplatePreview";
import { InvoiceFormList } from "@/components/InvoiceFormList/InvoiceFormList";
import { invoiceFormsApi } from "@/api/invoiceForms";
import { useAccount } from "@/hooks/api/useAccount";
import { useInvoiceForms } from "@/hooks/api/useInvoiceForms";
import { INVOICE_TEMPLATES, templatesFor } from "@/invoiceTemplates/registry";
import styles from "./page.module.scss";

export default function FormsPage() {
  const { templateKey } = useParams();
  const { data: account, error: accountError } = useAccount();
  const templates = templatesFor(account?.invoiceTemplates);
  const selected =
    templateKey && templates.includes(templateKey) ? templateKey : undefined;
  const { data: forms, error: loadError } = useInvoiceForms();
  const [error, setError] = useState("");
  const message =
    error || (loadError ? "ფაილების ჩატვირთვა ვერ მოხერხდა." : "");

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <span aria-current="page">ინვოისის ფორმები</span>
      </nav>

      <div className={styles.split}>
        <div className={styles.side}>
          <Card
            heading="ჩემი ფორმები"
            description="თქვენთვის მომზადებული ინვოისის ფორმები."
          >
            {!account && !accountError ? (
              <p className={styles.loading} role="status">
                ფორმები იტვირთება…
              </p>
            ) : templates.length === 0 ? (
              <p className={styles.loading}>ფორმები ჯერ არ არის.</p>
            ) : (
              <ul className={styles.templates}>
                {templates.map((key) => (
                  <li key={key}>
                    <Link
                      className={styles.template}
                      to={`/forms/${key}`}
                      aria-current={key === selected ? "page" : undefined}
                    >
                      <FileText
                        size={20}
                        aria-hidden
                        className={styles.templateIcon}
                      />
                      <span className={styles.templateName}>
                        {INVOICE_TEMPLATES[key].title}
                      </span>
                      <ChevronRight
                        size={18}
                        aria-hidden
                        className={styles.templateArrow}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card
            heading="ატვირთული ფაილები"
            description="Billo-ს მიერ თქვენთვის ატვირთული ფაილები."
          >
            {message && (
              <p className={styles.error} role="alert">
                {message}
              </p>
            )}
            {!forms && !loadError ? (
              <p className={styles.loading} role="status">
                ფაილები იტვირთება…
              </p>
            ) : (
              <InvoiceFormList
                forms={forms ?? []}
                download={(form) => invoiceFormsApi.download(form.id)}
                onError={setError}
              />
            )}
          </Card>
        </div>

        <section className={styles.preview} aria-label="ფორმის გადახედვა">
          {selected ? (
            <TemplatePreview templateKey={selected} />
          ) : (
            <p className={styles.previewHint}>
              {templateKey && account
                ? "ფორმა ვერ მოიძებნა."
                : "აირჩიეთ ფორმა სიიდან."}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
