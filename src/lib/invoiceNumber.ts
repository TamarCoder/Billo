
export function getMonthPart(reportingMonth: string | undefined): string {
  const match = /^\d{4}-(\d{2})/.exec(reportingMonth ?? "");
  return match ? match[1] : "";
}

export function buildInvoiceNumber(
  reportingMonth: string | undefined,
  companyNumber: string | undefined,
): string {
  if (!companyNumber) return "";
  return `${getMonthPart(reportingMonth)}/${companyNumber}`;
}