export interface InvoiceDraft {
  title: string;
  invoiceNumber: string;
  reportingDate: string;
  sendingDate: string;
  amount: string;
  amountInWords: string;
  reportingMonth: string;
  reportingDescription: string;
  issuerName: string;
  issuerIdentificationNumber: string;
  issuerAddress: string;
  bankAccount: string;
  bankName: string;
  bankCode: string;
  // Which organization template made this invoice. Old invoices have none (= "tatishvili").
  templateKey?: string;
}

export interface OrganizationSettings {
  title: string;
  issuerAddress: string;
  issuerIdentificationNumber: string;
  bankName: string;
  bankCode: string;
  bankAccount: string;
}

export type InvoiceStatus = "none" | "draft" | "sent" | "printed";

export interface InvoiceRecord {
  id: string;
  createdAt: string;
  status: InvoiceStatus;
  invoice: InvoiceDraft;
}

export interface Company {
  id: string;
  number: string;
  name: string;
}
