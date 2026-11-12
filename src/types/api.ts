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

// The organization sends its invoice sample (submitted). The owner builds the template in code
// (in_progress) and sends it for review (review). The organization approves it (approved) or asks
// for changes (changes_requested). The owner publishes it (live) and it appears in "My forms".
export type InvoiceFormStatus =
  | "submitted"
  | "in_progress"
  | "review"
  | "approved"
  | "changes_requested"
  | "live";

// An invoice sample the organization sent to Billo.
export interface InvoiceFormFile {
  id: string;
  organizationId: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  status?: InvoiceFormStatus;
  reviewComment?: string | null;
  templateKey?: string | null;
}
