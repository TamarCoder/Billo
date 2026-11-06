import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { invoicesApi } from "@/api/invoices";

export function useInvoices() {
  return useSWR(API_ENDPOINTS.invoices, invoicesApi.list);
}
