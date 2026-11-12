import { useIssuers } from "@/hooks/api/useIssuers";
import { INVOICE_TEMPLATES } from "@/invoiceTemplates/registry";

// One coded invoice template, filled with the organization's own data. Read only.
export function TemplatePreview({ templateKey }: { templateKey: string }) {
  const { data: issuers } = useIssuers();
  const template = INVOICE_TEMPLATES[templateKey];
  if (!template) return null;

  const issuer = issuers?.find((item) => item.isPrimary) ?? issuers?.[0];
  const Template = template.component;
  return (
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
