import { Link, useParams } from "react-router-dom";
import { ChevronRight, FileText, Paperclip } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { FileReview } from "@/components/FileReview/FileReview";
import { FormStatusBadge } from "@/components/FormStatusBadge/FormStatusBadge";
import { SampleUpload } from "@/components/SampleUpload/SampleUpload";
import { TemplatePreview } from "@/components/TemplatePreview/TemplatePreview";
import { useAccount } from "@/hooks/api/useAccount";
import { useInvoiceForms } from "@/hooks/api/useInvoiceForms";
import { INVOICE_TEMPLATES, templatesFor } from "@/invoiceTemplates/registry";
import styles from "./page.module.scss";

export default function FormsPage() {
  const { templateKey, fileId } = useParams();
  const { data: account, error: accountError } = useAccount();
  const { data: forms, error: loadError } = useInvoiceForms();
  const templates = templatesFor(account?.invoiceTemplates);
  const selectedTemplate =
    templateKey && templates.includes(templateKey) ? templateKey : undefined;
  const selectedFile = fileId
    ? forms?.find((form) => form.id === fileId)
    : undefined;

  let preview;
  if (selectedTemplate)
    preview = <TemplatePreview templateKey={selectedTemplate} />;
  else if (selectedFile) preview = <FileReview form={selectedFile} />;
  else {
    const missing = (templateKey && account) || (fileId && forms);
    preview = (
      <p className={styles.previewHint}>
        {missing ? "ფორმა ვერ მოიძებნა." : "აირჩიეთ ფორმა სიიდან."}
      </p>
    );
  }

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
                      aria-current={
                        key === selectedTemplate ? "page" : undefined
                      }
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
            heading="ჩემი ნიმუშები"
            description="გამოგვიგზავნეთ ინვოისი, რომელსაც დღეს იყენებთ. მის მიხედვით ავაწყობთ თქვენს ფორმას."
          >
            <SampleUpload />
            {loadError ? (
              <p className={styles.error} role="alert">
                ფაილების ჩატვირთვა ვერ მოხერხდა.
              </p>
            ) : !forms ? (
              <p className={styles.loading} role="status">
                ფაილები იტვირთება…
              </p>
            ) : forms.length === 0 ? (
              <p className={styles.loading}>ნიმუში ჯერ არ გაგიგზავნიათ.</p>
            ) : (
              <ul className={styles.templates}>
                {forms.map((form) => (
                  <li key={form.id}>
                    <Link
                      className={`${styles.template} ${styles.file}`}
                      to={`/forms/file/${form.id}`}
                      aria-current={form.id === fileId ? "page" : undefined}
                    >
                      <Paperclip
                        size={20}
                        aria-hidden
                        className={styles.templateIcon}
                      />
                      <span
                        className={styles.templateName}
                        title={form.fileName}
                      >
                        {form.fileName}
                      </span>
                      <FormStatusBadge status={form.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <section className={styles.preview} aria-label="ფორმის გადახედვა">
          {preview}
        </section>
      </div>
    </main>
  );
}
