import useSWR from "swr";
import { getSessionToken } from "@/lib/session";
import { API_ENDPOINTS } from "@/api/endpoints";
import { invoicesApi } from "@/api/invoices";

export function useInvoices() {
  return useSWR(getSessionToken() ? API_ENDPOINTS.invoices : null, invoicesApi.list);
}
