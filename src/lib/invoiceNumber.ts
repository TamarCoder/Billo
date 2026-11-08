// Invoice number format: #<company number>/<reporting month as two digits>, e.g. #01/09.
export const EMPTY_INVOICE_NUMBER = "#/";

function getMonthPart(reportingMonth: string | undefined): string {
  const match = /^\d{4}-(\d{2})/.exec(reportingMonth ?? "");
  return match ? match[1] : "";
}

export function buildInvoiceNumber(
  reportingMonth: string | undefined,
  companyNumber: string | undefined,
): string {
  return `#${companyNumber ?? ""}/${getMonthPart(reportingMonth)}`;
}
