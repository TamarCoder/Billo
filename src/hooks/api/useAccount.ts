import useSWR from "swr";
import { authApi } from "@/api/auth";
import { API_ENDPOINTS } from "@/api/endpoints";
import { getSessionToken } from "@/lib/session";

// The logged-in organization account, including its invoice templates.
export function useAccount() {
  return useSWR(getSessionToken() ? API_ENDPOINTS.authMe : null, authApi.me);
}
