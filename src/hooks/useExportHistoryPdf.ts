import { useEffect, type Dispatch, type SetStateAction } from "react";
import { updateInvoiceStatus } from "@/lib/invoiceStorage";
import type { InvoiceRecord } from "@/types/invoice";

interface UseExportHistoryPdfOptions {
  pdfRecord: InvoiceRecord | null;
  setPdfRecord: Dispatch<SetStateAction<InvoiceRecord | null>>;
  setRecords: Dispatch<SetStateAction<InvoiceRecord[]>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function useExportHistoryPdf({
  pdfRecord,
  setPdfRecord,
  setRecords,
  setError,
}: UseExportHistoryPdfOptions) {
  useEffect(() => {
    if (!pdfRecord) return;
    const frame = requestAnimationFrame(() => {
      void (async () => {
        try {
          if (window.electron) {
            const result = await window.electron.exportInvoicePdf();
            if (result.status !== "saved") return;
          } else {
            window.print();
          }
          setRecords(updateInvoiceStatus(pdfRecord.id, "printed"));
          setError("");
        } catch {
          setError("PDF-ის ექსპორტი ვერ მოხერხდა. სცადეთ ხელახლა.");
        } finally {
          setPdfRecord(null);
        }
      })();
    });
    return () => cancelAnimationFrame(frame);
  }, [pdfRecord, setError, setPdfRecord, setRecords]);
}
