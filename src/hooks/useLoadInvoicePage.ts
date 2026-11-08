import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { INVOICE_EDIT_ID_KEY } from "@/lib/invoiceStorage";
import type {
  InvoiceDraft,
  InvoiceRecord,
  OrganizationSettings,
} from "@/types/invoice";

interface UseLoadInvoicePageOptions {
  records: InvoiceRecord[];
  settings: OrganizationSettings;
  isReady: boolean;
  setFormResetKey: Dispatch<SetStateAction<number>>;
  setDraft: Dispatch<SetStateAction<InvoiceDraft>>;
  setRecordId: Dispatch<SetStateAction<string | null>>;
  setIsSaved: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function useLoadInvoicePage({
  records,
  settings,
  isReady,
  setFormResetKey,
  setDraft,
  setRecordId,
  setIsSaved,
  setError,
}: UseLoadInvoicePageOptions) {
  // Once an existing invoice is open, a list refresh must not overwrite its issuer.
  const isEditingRef = useRef(false);
  const appliedSettingsRef = useRef<OrganizationSettings | null>(null);

  useEffect(() => {
    if (!isReady) return;
    try {
      const editId = window.localStorage.getItem(INVOICE_EDIT_ID_KEY);
      if (editId) {
        window.localStorage.removeItem(INVOICE_EDIT_ID_KEY);
        const record = records.find((item) => item.id === editId);
        if (record) {
          isEditingRef.current = true;
          setDraft(() => record.invoice);
          setFormResetKey((key) => key + 1);
          setRecordId(record.id);
          setIsSaved(true);
          return;
        }
        setError("მოსაძებნი ინვოისი ისტორიაში ვერ მოიძებნა.");
      }
      if (isEditingRef.current || appliedSettingsRef.current === settings) return;
      appliedSettingsRef.current = settings;
      setDraft((current) => ({ ...current, ...settings }));
      setFormResetKey((key) => key + 1);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ინვოისის ჩატვირთვა ვერ მოხერხდა.",
      );
    }
  }, [
    isReady,
    records,
    settings,
    setDraft,
    setError,
    setFormResetKey,
    setIsSaved,
    setRecordId,
  ]);
}
