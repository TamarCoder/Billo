import { useMemo } from "react";
import type { InsuranceCompany, InvoiceRecord } from "@/types/invoice";

interface UseHistoryDataOptions {
  records: InvoiceRecord[];
  registeredCompanies: InsuranceCompany[];
  search: string;
  year: string;
  date: string;
  company: string;
  status: string;
  currentPage: number;
  itemsPerPage: number;
}

export function useHistoryData({
  records,
  registeredCompanies,
  search,
  year,
  date,
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
          [
            ...registeredCompanies.map((company) => company.name),
            ...records.map((record) => record.invoice.issuerName),
          ].filter(Boolean),
        ),
      ].sort((left, right) => left.localeCompare(right, "ka-GE")),
    [records, registeredCompanies],
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
        (!date || invoice.sendingDate === date) &&
        (!company || invoice.issuerName === company) &&
        (!status || record.status === status)
      );
    });
  }, [company, date, records, search, status, year]);
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
