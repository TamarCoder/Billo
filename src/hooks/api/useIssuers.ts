import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { issuersApi } from "@/api/issuers";

export function useIssuers() {
  return useSWR(API_ENDPOINTS.issuers, issuersApi.list);
}
