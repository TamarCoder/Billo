import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useInvoiceMutations } from "@/hooks/api/useInvoiceMutations";
import type { InvoiceRecord } from "@/types/invoice";

interface UseExportHistoryPdfOptions {
  pdfRecord: InvoiceRecord | null;
  setPdfRecord: Dispatch<SetStateAction<InvoiceRecord | null>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function useExportHistoryPdf({
  pdfRecord,
  setPdfRecord,
  setError,
}: UseExportHistoryPdfOptions) {
  const { changeInvoiceStatus } = useInvoiceMutations();
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
          await changeInvoiceStatus(pdfRecord.id, { status: "printed" });
          setError("");
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "PDF-ის ექსპორტი ვერ მოხერხდა. სცადეთ ხელახლა.",
          );
        } finally {
          setPdfRecord(null);
        }
      })();
    });
    return () => cancelAnimationFrame(frame);
  }, [changeInvoiceStatus, pdfRecord, setError, setPdfRecord]);
}
