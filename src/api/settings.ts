import { API_ENDPOINTS } from "@/api/endpoints";
import { fetcher } from "@/lib/fetcher";
import type {
  OrganizationSettingsResponse,
  UpdateOrganizationSettingsRequest,
} from "@/types/api";

export const settingsApi = {
  get: () => fetcher<OrganizationSettingsResponse>(API_ENDPOINTS.settings),

  update: (input: UpdateOrganizationSettingsRequest) =>
    fetcher<OrganizationSettingsResponse>(API_ENDPOINTS.settings, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
};
