import type {
  InvoiceDraft,
  InvoiceRecord,
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
