import { useState } from "react";
import {
  EMPTY_ORGANIZATION_SETTINGS,
} from "@/lib/invoiceStorage";
import type { OrganizationSettings } from "@/types/invoice";

export function useSettingsPageState() {
  const [values, setValues] = useState<OrganizationSettings>(
    EMPTY_ORGANIZATION_SETTINGS,
  );
  const [savedValues, setSavedValues] = useState<OrganizationSettings>(
    EMPTY_ORGANIZATION_SETTINGS,
  );
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  return {
    values,
    setValues,
    savedValues,
    setSavedValues,
    error,
    setError,
    isSaved,
    setIsSaved,
  };
}
