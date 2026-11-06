import { useEffect, type Dispatch, type SetStateAction } from "react";
import {
  readOrganizationSettings,
} from "@/lib/invoiceStorage";
import type { OrganizationSettings } from "@/types/invoice";

interface UseLoadOrganizationSettingsOptions {
  setValues: Dispatch<SetStateAction<OrganizationSettings>>;
  setSavedValues: Dispatch<SetStateAction<OrganizationSettings>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function useLoadOrganizationSettings({
  setValues,
  setSavedValues,
  setError,
}: UseLoadOrganizationSettingsOptions) {
  useEffect(() => {
    try {
      const settings = readOrganizationSettings();
      setValues(settings);
      setSavedValues(settings);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "ორგანიზაციის მონაცემების ჩატვირთვა ვერ მოხერხდა.",
      );
    }
  }, [setError, setSavedValues, setValues]);
}
