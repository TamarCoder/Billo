import { API_ENDPOINTS } from "@/api/endpoints";
import { fetchBlob, fetcher } from "@/lib/fetcher";
import type { InvoiceFormFile } from "@/types/api";

export const invoiceFormsApi = {
  list: () => fetcher<InvoiceFormFile[]>(API_ENDPOINTS.invoiceForms),
  download: (id: string) => fetchBlob(API_ENDPOINTS.invoiceFormFile(id)),
};
