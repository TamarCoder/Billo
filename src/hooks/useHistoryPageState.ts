import { useState } from "react";
import type { InvoiceRecord } from "@/types/invoice";

export function useHistoryPageState() {
  const [search, setSearch] = useState("");
  const [reportingMonth, setReportingMonth] = useState("");
  const [date, setDate] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfRecord, setPdfRecord] = useState<InvoiceRecord | null>(null);
  const [error, setError] = useState("");

  return {
    search,
    setSearch,
    reportingMonth,
    setReportingMonth,
    date,
    setDate,
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
