import { API_ENDPOINTS } from "@/api/endpoints";
import { fetchBlob, fetcher } from "@/lib/fetcher";
import type { InvoiceFormFile } from "@/types/api";

export const invoiceFormsApi = {
  list: () => fetcher<InvoiceFormFile[]>(API_ENDPOINTS.invoiceForms),
  download: (id: string) => fetchBlob(API_ENDPOINTS.invoiceFormFile(id)),
  upload: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return fetcher<InvoiceFormFile>(API_ENDPOINTS.invoiceForms, { method: "POST", body });
  },
  approve: (id: string) =>
    fetcher<InvoiceFormFile>(API_ENDPOINTS.invoiceFormApprove(id), { method: "POST" }),
  requestChanges: (id: string, comment: string) =>
    fetcher<InvoiceFormFile>(API_ENDPOINTS.invoiceFormRequestChanges(id), {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
};
