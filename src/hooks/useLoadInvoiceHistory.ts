import { useEffect, type Dispatch, type SetStateAction } from "react";
import { readInvoiceHistory } from "@/lib/invoiceStorage";
import type { InvoiceRecord } from "@/types/invoice";

interface UseLoadInvoiceHistoryOptions {
  setRecords: Dispatch<SetStateAction<InvoiceRecord[]>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function useLoadInvoiceHistory({
  setRecords,
  setError,
}: UseLoadInvoiceHistoryOptions) {
  useEffect(() => {
    try {
      setRecords(readInvoiceHistory());
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ინვოისების ისტორიის ჩატვირთვა ვერ მოხერხდა.",
      );
    }
  }, [setError, setRecords]);
}
