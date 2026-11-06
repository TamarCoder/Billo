import { useState } from "react";
import type { InvoiceRecord } from "@/types/invoice";

export function useHistoryPageState() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfRecord, setPdfRecord] = useState<InvoiceRecord | null>(null);
  const [error, setError] = useState("");

  return {
    search,
    setSearch,
    year,
    setYear,
    company,
    setCompany,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    pdfRecord,
    setPdfRecord,
    error,
    setError,
  };
}
