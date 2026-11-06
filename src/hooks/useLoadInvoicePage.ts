import { useEffect, type Dispatch, type SetStateAction } from "react";
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
  useEffect(() => {
    if (!isReady) return;
    try {
      const editId = window.localStorage.getItem(INVOICE_EDIT_ID_KEY);
      if (!editId) {
        setDraft((current) => ({ ...current, ...settings }));
        setFormResetKey((key) => key + 1);
        return;
      }
      const record = records.find((item) => item.id === editId);
      if (record) {
        setDraft(() => record.invoice);
        setFormResetKey((key) => key + 1);
        setRecordId(record.id);
        setIsSaved(true);
        window.localStorage.removeItem(INVOICE_EDIT_ID_KEY);
      } else {
        setError("მოსაძებნი ინვოისი ისტორიაში ვერ მოიძებნა.");
      }
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
