import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { issuersApi } from "@/api/issuers";
import { getSessionToken } from "@/lib/session";

// The sidebar is mounted on login/register too; without a session there is nothing to load.
export function useIssuers() {
  return useSWR(getSessionToken() ? API_ENDPOINTS.issuers : null, issuersApi.list);
}
