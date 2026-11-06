import { useEffect } from "react";
import { OrganizationSettingsForm } from "@/components/OrganizationSettingsForm/OrganizationSettingsForm";
import { useOrganizationSettings } from "@/hooks/api/useOrganizationSettings";
import { useSettingsMutation } from "@/hooks/api/useSettingsMutation";
import { useSettingsPageState } from "@/hooks/useSettingsPageState";
import type { OrganizationSettings } from "@/types/invoice";
import styles from "./page.module.scss";

export default function Settings() {
  const {
    data: loadedSettings,
    error: loadError,
  } = useOrganizationSettings();
  const { updateSettings } = useSettingsMutation();
  const {
    values,
    setValues,
    setSavedValues,
    error,
    setError,
    isSaved,
    setIsSaved,
  } = useSettingsPageState();
  useEffect(() => {
    if (!loadedSettings) return;
    setValues(loadedSettings);
    setSavedValues(loadedSettings);
  }, [loadedSettings, setSavedValues, setValues]);

  const markSettingsChanged = () => {
    setIsSaved(false);
    setError("");
  };

  const saveSettings = async (settings: OrganizationSettings) => {
    setError("");
    try {
      const saved = await updateSettings(settings);
      setValues(saved);
      setSavedValues(saved);
      setIsSaved(true);
      setError("");
    } catch (saveError) {
      setIsSaved(false);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "ორგანიზაციის მონაცემების შენახვა ვერ მოხერხდა.",
      );
    }
  };

  const cancelChanges = () => {
    setIsSaved(false);
    setError("");
  };

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <span>მთავარი</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">პარამეტრები</span>
      </nav>

      <OrganizationSettingsForm
        values={values}
        error={
          error ||
          (loadError instanceof Error
            ? loadError.message
            : loadError
              ? "ორგანიზაციის მონაცემების ჩატვირთვა ვერ მოხერხდა."
              : "")
        }
        isSaved={isSaved}
        onEdit={markSettingsChanged}
        onSubmit={saveSettings}
        onCancel={cancelChanges}
      />
    </main>
  );
}
