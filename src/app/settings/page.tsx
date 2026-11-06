import { OrganizationSettingsForm } from "@/components/OrganizationSettingsForm/OrganizationSettingsForm";
import {
  writeOrganizationSettings,
} from "@/lib/invoiceStorage";
import { useLoadOrganizationSettings } from "@/hooks/useLoadOrganizationSettings";
import { useSettingsPageState } from "@/hooks/useSettingsPageState";
import type { OrganizationSettings } from "@/types/invoice";
import styles from "./page.module.scss";

export default function Settings() {
  const {
    values,
    setValues,
    setSavedValues,
    error,
    setError,
    isSaved,
    setIsSaved,
  } = useSettingsPageState();
  useLoadOrganizationSettings({ setValues, setSavedValues, setError });

  const markSettingsChanged = () => {
    setIsSaved(false);
    setError("");
  };

  const saveSettings = (settings: OrganizationSettings) => {
    try {
      writeOrganizationSettings(settings);
      setValues(settings);
      setSavedValues(settings);
      setIsSaved(true);
      setError("");
    } catch {
      setIsSaved(false);
      setError("ორგანიზაციის მონაცემების შენახვა ვერ მოხერხდა.");
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
        error={error}
        isSaved={isSaved}
        onEdit={markSettingsChanged}
        onSubmit={saveSettings}
        onCancel={cancelChanges}
      />
    </main>
  );
}
