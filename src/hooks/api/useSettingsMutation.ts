import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { settingsApi } from "@/api/settings";
import type { UpdateOrganizationSettingsRequest } from "@/types/api";

export function useSettingsMutation() {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating } = useSWRMutation(
    API_ENDPOINTS.settings,
    (_key, { arg }: { arg: UpdateOrganizationSettingsRequest }) =>
      settingsApi.update(arg),
  );

  const updateSettings = async (values: UpdateOrganizationSettingsRequest) => {
    const settings = await trigger(values);
    await mutate(API_ENDPOINTS.settings);
    return settings;
  };

  return { updateSettings, isMutating };
}
