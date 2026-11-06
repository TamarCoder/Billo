import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { settingsApi } from "@/api/settings";

export function useOrganizationSettings() {
  return useSWR(API_ENDPOINTS.settings, settingsApi.get);
}
