import useSWR from "swr";
import { getSessionToken } from "@/lib/session";
import { API_ENDPOINTS } from "@/api/endpoints";
import { settingsApi } from "@/api/settings";

export function useOrganizationSettings() {
  return useSWR(getSessionToken() ? API_ENDPOINTS.settings : null, settingsApi.get);
}
