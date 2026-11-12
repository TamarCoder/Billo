import { Link, useParams } from "react-router-dom";
import { useAccount } from "@/hooks/api/useAccount";
import { useIssuers } from "@/hooks/api/useIssuers";
import { INVOICE_TEMPLATES, templatesFor } from "@/invoiceTemplates/registry";
import styles from "../page.module.scss";

// Shows one invoice template, filled with the organization's own data. Read only.
export default function FormTemplatePage() {
  const { templateKey = "" } = useParams();
  const { data: account, error: accountError } = useAccount();
  const { data: issuers } = useIssuers();

  const allowed = account ? templatesFor(account.invoiceTemplates).includes(templateKey) : false;
  const template = allowed ? INVOICE_TEMPLATES[templateKey] : undefined;
  const issuer = issuers?.find((item) => item.isPrimary) ?? issuers?.[0];

  let body;
  if (!account && !accountError) {
    body = <p className={styles.loading} role="status">ფორმა იტვირთება…</p>;
  } else if (!template) {
    body = <p className={styles.error} role="alert">ფორმა ვერ მოიძებნა.</p>;
  } else {
    const Template = template.component;
    body = (
      <Template
        organization={issuer?.title ?? ""}
        address={issuer?.issuerAddress ?? ""}
        identificationNumber={issuer?.issuerIdentificationNumber ?? ""}
        bankName={issuer?.bankName ?? ""}
        bankCode={issuer?.bankCode ?? ""}
        bankAccount={issuer?.bankAccount ?? ""}
        invoiceNumber=""
        reportingDate=""
        sendingDate=""
        companyName=""
        reportingMonth=""
        serviceDescription=""
        amount=""
        amountInWords=""
      />
    );
  }

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <Link to="/forms">ინვოისის ფორმები</Link>
        {" / "}
        <span aria-current="page">{template?.title ?? "ფორმა"}</span>
      </nav>
      {body}
    </main>
  );
}
