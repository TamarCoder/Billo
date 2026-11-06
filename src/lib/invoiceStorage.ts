import type {
  InvoiceDraft,
  InvoiceRecord,
  InvoiceStatus,
  OrganizationSettings,
} from "@/types/invoice";

export const INVOICE_HISTORY_KEY = "billo-invoice-history";
export const INVOICE_EDIT_ID_KEY = "billo-invoice-edit-id";
export const ORGANIZATION_SETTINGS_KEY = "billo-organization-settings";

export const DEFAULT_ORGANIZATION_SETTINGS: OrganizationSettings = {
  title: "დავით ტატიშვილის ჯანმრთელობის ცენტრი",
  issuerAddress: "თბილისი, პეკინის 28",
  issuerIdentificationNumber: "ს/კ 405310612",
  bankName: "საქართველოს ბანკი",
  bankCode: "BAGAGE22",
  bankAccount: "ა/ნ GE76BG0000000160872875GEL",
};

const invoiceFields: (keyof InvoiceDraft)[] = [
  "title",
  "invoiceNumber",
  "reportingDate",
  "sendingDate",
  "amount",
  "amountInWords",
  "reportingMonth",
  "reportingDescription",
  "issuerName",
  "issuerIdentificationNumber",
  "issuerAddress",
  "bankAccount",
  "bankName",
  "bankCode",
];

function isInvoiceDraft(value: unknown): value is InvoiceDraft {
  return (
    typeof value === "object" &&
    value !== null &&
    invoiceFields.every(
      (field) =>
        typeof (value as Record<keyof InvoiceDraft, unknown>)[field] ===
        "string",
    )
  );
}

function isOrganizationSettings(value: unknown): value is OrganizationSettings {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.keys(DEFAULT_ORGANIZATION_SETTINGS).every(
      (key) =>
        typeof (value as Record<keyof OrganizationSettings, unknown>)[
          key as keyof OrganizationSettings
        ] === "string",
    )
  );
}

export function readOrganizationSettings(): OrganizationSettings {
  const stored = window.localStorage.getItem(ORGANIZATION_SETTINGS_KEY);
  if (stored === null) return DEFAULT_ORGANIZATION_SETTINGS;

  const settings: unknown = JSON.parse(stored);
  if (!isOrganizationSettings(settings)) {
    throw new Error("ორგანიზაციის შენახული მონაცემები დაზიანებულია.");
  }
  return settings;
}

export function writeOrganizationSettings(
  settings: OrganizationSettings,
): void {
  window.localStorage.setItem(
    ORGANIZATION_SETTINGS_KEY,
    JSON.stringify(settings),
  );
}

export function readInvoiceHistory(): InvoiceRecord[] {
  const stored = window.localStorage.getItem(INVOICE_HISTORY_KEY);
  if (stored === null) return [];

  const records: unknown = JSON.parse(stored);
  if (
    !Array.isArray(records) ||
    !records.every(
      (record) =>
        typeof record?.id === "string" &&
        typeof record?.createdAt === "string" &&
        ["none", "draft", "sent", "printed"].includes(record?.status) &&
        isInvoiceDraft(record?.invoice),
    )
  ) {
    throw new Error("შენახული ინვოისების ისტორია დაზიანებულია.");
  }
  return records;
}

export function writeInvoiceHistory(records: InvoiceRecord[]): void {
  window.localStorage.setItem(INVOICE_HISTORY_KEY, JSON.stringify(records));
}

export function saveInvoice(
  invoice: InvoiceDraft,
  id?: string,
): InvoiceRecord[] {
  const records = readInvoiceHistory();
  const existing = id
    ? records.find((record) => record.id === id)
    : records.find(
        (record) =>
          record.invoice.issuerName === invoice.issuerName &&
          record.invoice.reportingMonth === invoice.reportingMonth,
      );
  const record: InvoiceRecord = {
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    status: existing?.status ?? "draft",
    invoice,
  };
  const updated = existing
    ? records.map((item) => (item.id === existing.id ? record : item))
    : [record, ...records];
  writeInvoiceHistory(updated);
  return updated;
}

export function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
): InvoiceRecord[] {
  const records = readInvoiceHistory().map((record) =>
    record.id === id ? { ...record, status } : record,
  );
  writeInvoiceHistory(records);
  return records;
}

export function deleteInvoice(id: string): InvoiceRecord[] {
  const records = readInvoiceHistory().filter((record) => record.id !== id);
  writeInvoiceHistory(records);
  return records;
}
