import { API_ENDPOINTS } from "@/api/endpoints";
import { fetcher } from "@/lib/fetcher";
import type {
  CreateInvoiceRequest,
  InvoiceListResponse,
  InvoiceResponse,
  UpdateInvoiceRequest,
  UpdateInvoiceStatusRequest,
} from "@/types/api";

export const invoicesApi = {
  list: () => fetcher<InvoiceListResponse>(API_ENDPOINTS.invoices),

  create: (input: CreateInvoiceRequest) =>
    fetcher<InvoiceResponse>(API_ENDPOINTS.invoices, {
      method: "POST",
      body: JSON.stringify(input),
    }),

  update: (id: string, input: UpdateInvoiceRequest) =>
    fetcher<InvoiceResponse>(API_ENDPOINTS.invoice(id), {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  updateStatus: (id: string, input: UpdateInvoiceStatusRequest) =>
    fetcher<InvoiceResponse>(API_ENDPOINTS.invoiceStatus(id), {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  delete: (id: string) =>
    fetcher<void>(API_ENDPOINTS.invoice(id), { method: "DELETE" }),
};
