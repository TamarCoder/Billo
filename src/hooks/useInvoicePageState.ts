import { useState } from "react";
import type { InvoiceDraft } from "@/types/invoice";

export function useInvoicePageState(initialDraft: () => InvoiceDraft) {
  const [draft, setDraft] = useState<InvoiceDraft>(initialDraft);
  const [isSaved, setIsSaved] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [pdfSaved, setPdfSaved] = useState(false);

  return {
    draft,
    setDraft,
    isSaved,
    setIsSaved,
    recordId,
    setRecordId,
    saveError,
    setSaveError,
    pdfError,
    setPdfError,
    pdfSaved,
    setPdfSaved,
  };
}
