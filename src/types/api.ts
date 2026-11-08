import type {
  Company,
  InvoiceDraft,
  InvoiceRecord,
  InvoiceStatus,
  OrganizationSettings,
} from "@/types/invoice";

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

export type CreateCompanyRequest = Pick<
  Company,
  "number" | "name"
>;
export type UpdateCompanyRequest = Pick<
  Company,
  "number" | "name"
>;

export type CreateInvoiceRequest = InvoiceDraft;
export type UpdateInvoiceRequest = InvoiceDraft;
export interface UpdateInvoiceStatusRequest {
  status: InvoiceStatus;
}

export type UpdateOrganizationSettingsRequest = OrganizationSettings;

export type CompanyListResponse = Company[];
export type InvoiceListResponse = InvoiceRecord[];
export type CompanyResponse = Company;
export type InvoiceResponse = InvoiceRecord;
export type OrganizationSettingsResponse = OrganizationSettings;

// An organization the account issues invoices as; the primary one is the account itself.
export interface Issuer extends OrganizationSettings {
  id: string;
  isPrimary: boolean;
}
