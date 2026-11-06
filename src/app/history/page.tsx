import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/Card/Card";
import { InvoiceDocument } from "@/components/InvoiceDocument/InvoiceDocument";
import { InvoiceHistoryTable } from "@/components/InvoiceHistoryTable/InvoiceHistoryTable";
import { INVOICE_STATUS_OPTIONS } from "@/components/InvoiceHistoryTable/invoiceStatus";
import { Button } from "@/ui/Button/Button";
import { Input } from "@/ui/Input/Input";
import { Pagination } from "@/ui/Pagination/Pagination";
import { Dropdown } from "@/ui/Dropdown/Dropdown";
import { useHistoryData } from "@/hooks/useHistoryData";
import { useHistoryPageState } from "@/hooks/useHistoryPageState";
import { useExportHistoryPdf } from "@/hooks/useExportHistoryPdf";
import { INVOICE_EDIT_ID_KEY } from "@/lib/invoiceStorage";
import { useInvoices } from "@/hooks/api/useInvoices";
import { useInvoiceMutations } from "@/hooks/api/useInvoiceMutations";
import type { InvoiceRecord } from "@/types/invoice";
import styles from "./page.module.scss";

const ITEMS_PER_PAGE = 7;

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}.${month}.${year}` : value;
}

function formatReportingMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) return value;
  return new Intl.DateTimeFormat("ka-GE", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

export default function History() {
  const navigate = useNavigate();
  const { data: records = [], error: loadError } = useInvoices();
  const { deleteInvoice: removeInvoice } = useInvoiceMutations();
  const {
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
  } = useHistoryPageState();
  useExportHistoryPdf({ pdfRecord, setPdfRecord, setError });

  const { years, companies, filteredRecords, totalPages, visibleRecords } =
    useHistoryData({
      records,
      search,
      year,
      company,
      status,
      currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  const removeRecord = async (record: InvoiceRecord) => {
    if (!window.confirm(`წაიშალოს ინვოისი № ${record.invoice.invoiceNumber}?`)) {
      return;
    }
    try {
      await removeInvoice(record.id);
      setCurrentPage((page) =>
        Math.min(
          page,
          Math.max(1, Math.ceil((filteredRecords.length - 1) / ITEMS_PER_PAGE)),
        ),
      );
      setError("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ინვოისის წაშლა ვერ მოხერხდა.",
      );
    }
  };

  const editRecord = (record: InvoiceRecord) => {
    try {
      window.localStorage.setItem(INVOICE_EDIT_ID_KEY, record.id);
      navigate("/home");
    } catch {
      setError("ინვოისის გასახსნელად მომზადება ვერ მოხერხდა.");
    }
  };

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <div className={styles.breadcrumbPath}>
          <span>მთავარი</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">ინვოისების ისტორია</span>
        </div>
        <div className={styles.pageActions}>
          <label className={styles.searchField}>
            <Search className={styles.searchIcon} size={17} aria-hidden="true" />
            <Input
              className={styles.searchInput}
              size="sm"
              type="search"
              aria-label="ინვოისის ძებნა"
              placeholder="ძებნა ნომრით ან სადაზღვევოთი..."
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                setCurrentPage(1);
              }}
            />
          </label>
          <Button
            size="sm"
            leadingIcon={<Plus size={16} />}
            onClick={() => navigate("/home")}
          >
            ახალი ინვოისი
          </Button>
        </div>
      </nav>

      <Card className={styles.historyCard} padding="sm">
        <div className={styles.filters} aria-label="ინვოისების ფილტრები">
          <div className={`${styles.filter} ${styles.yearFilter}`}>
            <span>წელი</span>
            <Dropdown
              className={styles.filterSelect}
              aria-label="წლის მიხედვით გაფილტვრა"
              options={[
                { value: "", label: "ყველა" },
                ...years.map((item) => ({ value: item, label: item })),
              ]}
              value={year}
              onChange={(value) => {
                setYear(value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className={`${styles.filter} ${styles.companyFilter}`}>
            <span>სადაზღვევო</span>
            <Dropdown
              className={styles.filterSelect}
              aria-label="სადაზღვევო კომპანიის მიხედვით გაფილტვრა"
              options={[
                { value: "", label: "ყველა" },
                ...companies.map((item) => ({ value: item, label: item })),
              ]}
              value={company}
              onChange={(value) => {
                setCompany(value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className={`${styles.filter} ${styles.statusFilter}`}>
            <span>სტატუსი</span>
            <Dropdown
              className={styles.filterSelect}
              aria-label="სტატუსის მიხედვით გაფილტვრა"
              options={[
                { value: "", label: "ყველა" },
                ...Object.entries(INVOICE_STATUS_OPTIONS).map(
                  ([value, option]) => ({
                    value,
                    label: option.label,
                  }),
                ),
              ]}
              value={status}
              onChange={(value) => {
                setStatus(value);
                setCurrentPage(1);
              }}
            />
          </div>
          <span className={styles.filterSummary}>
            {filteredRecords.length} ინვოისი
          </span>
        </div>

        {(error ||
          (loadError instanceof Error
            ? loadError.message
            : loadError
              ? "ინვოისების ჩატვირთვა ვერ მოხერხდა."
              : "")) && (
          <p className={styles.error} role="alert">
            {error ||
              (loadError instanceof Error
                ? loadError.message
                : "ინვოისების ჩატვირთვა ვერ მოხერხდა.")}
          </p>
        )}

        <InvoiceHistoryTable
          records={visibleRecords}
          onEdit={editRecord}
          onExportPdf={setPdfRecord}
          onDelete={removeRecord}
          emptyMessage={
            records.length === 0
              ? "შენახული ინვოისები ჯერ არ არის."
              : "მითითებული კრიტერიუმებით ინვოისი ვერ მოიძებნა."
          }
        />

        {filteredRecords.length > ITEMS_PER_PAGE && (
          <Pagination
            className={styles.pagination}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRecords.length}
            onPageChange={setCurrentPage}
            aria-label="ინვოისების გვერდები"
          />
        )}
      </Card>
      {pdfRecord && (
        <div className={styles.printDocument}>
          <InvoiceDocument
            organization={pdfRecord.invoice.title}
            invoiceNumber={pdfRecord.invoice.invoiceNumber}
            reportingDate={formatDate(pdfRecord.invoice.reportingDate)}
            sendingDate={formatDate(pdfRecord.invoice.sendingDate)}
            address={pdfRecord.invoice.issuerAddress}
            identificationNumber={pdfRecord.invoice.issuerIdentificationNumber}
            bankName={pdfRecord.invoice.bankName}
            bankCode={pdfRecord.invoice.bankCode}
            bankAccount={pdfRecord.invoice.bankAccount}
            companyName={pdfRecord.invoice.issuerName}
            reportingMonth={formatReportingMonth(
              pdfRecord.invoice.reportingMonth,
            )}
            serviceDescription={pdfRecord.invoice.reportingDescription}
            amount={pdfRecord.invoice.amount}
            amountInWords={pdfRecord.invoice.amountInWords}
          />
        </div>
      )}
    </main>
  );
}
