import type {
  InsuranceCompany,
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

export type CreateInsuranceCompanyRequest = Pick<InsuranceCompany, "name">;
export type UpdateInsuranceCompanyRequest = Pick<InsuranceCompany, "name">;

export type CreateInvoiceRequest = InvoiceDraft;
export type UpdateInvoiceRequest = InvoiceDraft;
export interface UpdateInvoiceStatusRequest {
  status: InvoiceStatus;
}

export type UpdateOrganizationSettingsRequest = OrganizationSettings;

export type CompanyListResponse = InsuranceCompany[];
export type InvoiceListResponse = InvoiceRecord[];
export type CompanyResponse = InsuranceCompany;
export type InvoiceResponse = InvoiceRecord;
export type OrganizationSettingsResponse = OrganizationSettings;
