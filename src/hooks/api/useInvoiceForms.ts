import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { invoiceFormsApi } from "@/api/invoiceForms";
import { getSessionToken } from "@/lib/session";

// Re-checks every minute and on window focus, so a newly uploaded form shows up by itself.
export function useInvoiceForms() {
  return useSWR(getSessionToken() ? API_ENDPOINTS.invoiceForms : null, invoiceFormsApi.list, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });
}
