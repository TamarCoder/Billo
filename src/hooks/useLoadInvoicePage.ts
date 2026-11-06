import { useEffect, type Dispatch, type SetStateAction } from "react";
import {
  INVOICE_EDIT_ID_KEY,
  readInvoiceHistory,
  readOrganizationSettings,
} from "@/lib/invoiceStorage";
import type { InvoiceDraft } from "@/types/invoice";

interface UseLoadInvoicePageOptions {
  loadCompanies: () => void;
  setFormResetKey: Dispatch<SetStateAction<number>>;
  setDraft: Dispatch<SetStateAction<InvoiceDraft>>;
  setRecordId: Dispatch<SetStateAction<string | null>>;
  setIsSaved: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function useLoadInvoicePage({
  loadCompanies,
  setFormResetKey,
  setDraft,
  setRecordId,
  setIsSaved,
  setError,
}: UseLoadInvoicePageOptions) {
  useEffect(() => {
    try {
      loadCompanies();
      const editId = window.localStorage.getItem(INVOICE_EDIT_ID_KEY);
      if (!editId) {
        setDraft((current) => ({ ...current, ...readOrganizationSettings() }));
        setFormResetKey((key) => key + 1);
        return;
      }
      const record = readInvoiceHistory().find((item) => item.id === editId);
      if (record) {
        setDraft(() => record.invoice);
        setFormResetKey((key) => key + 1);
        setRecordId(record.id);
        setIsSaved(true);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ინვოისის ჩატვირთვა ვერ მოხერხდა.",
      );
    }
  }, [
    loadCompanies,
    setDraft,
    setError,
    setFormResetKey,
    setIsSaved,
    setRecordId,
  ]);
}
