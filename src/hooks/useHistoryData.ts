import { useMemo } from "react";
import type { InvoiceRecord } from "@/types/invoice";

interface UseHistoryDataOptions {
  records: InvoiceRecord[];
  search: string;
  year: string;
  company: string;
  status: string;
  currentPage: number;
  itemsPerPage: number;
}

export function useHistoryData({
  records,
  search,
  year,
  company,
  status,
  currentPage,
  itemsPerPage,
}: UseHistoryDataOptions) {
  const years = useMemo(
    () =>
      [
        ...new Set(
          records.map((record) => record.invoice.reportingMonth.slice(0, 4)),
        ),
      ]
        .filter((value) => /^\d{4}$/u.test(value))
        .sort((left, right) => right.localeCompare(left)),
    [records],
  );
  const companies = useMemo(
    () =>
      [
        ...new Set(
          records.map((record) => record.invoice.issuerName).filter(Boolean),
        ),
      ].sort((left, right) => left.localeCompare(right, "ka-GE")),
    [records],
  );
  const filteredRecords = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ka-GE");
    return records.filter((record) => {
      const invoice = record.invoice;
      return (
        (!query ||
          invoice.invoiceNumber.toLocaleLowerCase("ka-GE").includes(query) ||
          invoice.issuerName.toLocaleLowerCase("ka-GE").includes(query)) &&
        (!year || invoice.reportingMonth.startsWith(year)) &&
        (!company || invoice.issuerName === company) &&
        (!status || record.status === status)
      );
    });
  }, [company, records, search, status, year]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / itemsPerPage),
  );
  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return { years, companies, filteredRecords, totalPages, visibleRecords };
}
