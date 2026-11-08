import type { OrganizationSettings } from "@/types/invoice";

export const INVOICE_EDIT_ID_KEY = "billo-invoice-edit-id";

export const EMPTY_ORGANIZATION_SETTINGS: OrganizationSettings = {
  title: "",
  issuerAddress: "",
  issuerIdentificationNumber: "",
  bankName: "",
  bankCode: "",
  bankAccount: "",
};
