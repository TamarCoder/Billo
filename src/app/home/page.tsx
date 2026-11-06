import { useState } from "react";
import { InvoiceDocument } from "@/components/InvoiceDocument/InvoiceDocument";
import { InvoiceForm } from "@/components/InvoiceForm/InvoiceForm";
import { useInvoicePageState } from "@/hooks/useInvoicePageState";
import { useLoadInvoicePage } from "@/hooks/useLoadInvoicePage";
import {
  DEFAULT_ORGANIZATION_SETTINGS,
  INVOICE_EDIT_ID_KEY,
  saveInvoice,
  updateInvoiceStatus,
} from "@/lib/invoiceStorage";
import type { InvoiceDraft } from "@/types/invoice";
import { useCompaniesStore } from "@/store/useCompaniesStore";
import styles from "./page.module.scss";

function formatInvoiceDate(value: string) {
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

function getInitialDraft(): InvoiceDraft {
  const today = new Date();
  const reportingDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    ...DEFAULT_ORGANIZATION_SETTINGS,
    invoiceNumber: "",
    reportingDate: `${reportingDate.getFullYear()}-${String(
      reportingDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(reportingDate.getDate()).padStart(2, "0")}`,
    sendingDate: `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
    amount: "",
    amountInWords: "",
    reportingMonth: `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}`,
    reportingDescription: "სამედიცინო მომსახურეობა, ამბულატორია",
    issuerName: "",
  };
}

export default function Home() {
  const companies = useCompaniesStore((state) => state.companies);
  const loadCompanies = useCompaniesStore((state) => state.loadCompanies);
  const [formResetKey, setFormResetKey] = useState(0);
  const {
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
  } = useInvoicePageState(getInitialDraft);
  useLoadInvoicePage({
    loadCompanies,
    setFormResetKey,
    setDraft,
    setRecordId,
    setIsSaved,
    setError: setSaveError,
  });

  const updateDraft = <Field extends keyof InvoiceDraft>(
    field: Field,
    value: InvoiceDraft[Field],
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setIsSaved(false);
    setSaveError("");
    setPdfError("");
    setPdfSaved(false);
  };

  const saveDraft = (values: InvoiceDraft) => {
    try {
      setDraft(values);
      window.localStorage.setItem("billo-invoice-draft", JSON.stringify(values));
      const editId = window.localStorage.getItem(INVOICE_EDIT_ID_KEY);
      const records = saveInvoice(values, editId ?? undefined);
      const savedRecord = editId
        ? records.find((item) => item.id === editId)
        : records.find(
            (item) =>
              item.invoice.issuerName === values.issuerName &&
              item.invoice.reportingMonth === values.reportingMonth,
          );
      if (!savedRecord) {
        throw new Error("შენახული ინვოისი ისტორიაში ვერ მოიძებნა.");
      }
      setRecordId(savedRecord.id);
      window.localStorage.removeItem(INVOICE_EDIT_ID_KEY);
      setIsSaved(true);
      setSaveError("");
      setPdfError("");
      setPdfSaved(false);
    } catch {
      setIsSaved(false);
      setSaveError("ინვოისის შენახვა ვერ მოხერხდა. სცადეთ ხელახლა.");
    }
  };

  const resetDraft = () => {
    setDraft(getInitialDraft());
    setFormResetKey((key) => key + 1);
    setRecordId(null);
    window.localStorage.removeItem(INVOICE_EDIT_ID_KEY);
    setIsSaved(false);
    setSaveError("");
    setPdfError("");
    setPdfSaved(false);
  };

  const exportPdf = async () => {
    setPdfError("");
    setPdfSaved(false);
    try {
      if (!window.electron) {
        window.print();
        if (recordId) updateInvoiceStatus(recordId, "printed");
        return;
      }

      const result = await window.electron.exportInvoicePdf();
      setPdfSaved(result.status === "saved");
      if (result.status === "saved" && recordId) {
        updateInvoiceStatus(recordId, "printed");
      }
    } catch {
      setPdfError("PDF-ის ექსპორტი ვერ მოხერხდა. სცადეთ ხელახლა.");
    }
  };

  const printInvoice = () => {
    window.print();
    if (recordId) {
      try {
        updateInvoiceStatus(recordId, "printed");
      } catch {
        setSaveError("ინვოისის სტატუსის განახლება ვერ მოხერხდა.");
      }
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <span>მთავარი</span>
        <span aria-hidden="true">/</span>
        <span>ინვოისის მომზადება</span>
      </nav>

      <InvoiceForm
        key={formResetKey}
        initialValues={draft}
        companies={companies}
        isSaved={isSaved}
        saveError={saveError}
        pdfError={pdfError}
        pdfSaved={pdfSaved}
        onDraftChange={updateDraft}
        onSubmit={saveDraft}
        onReset={resetDraft}
        onPrint={printInvoice}
        onExportPdf={exportPdf}
      />

      {isSaved && (
        <section className={styles.invoicePreview} aria-label="ინვოისის გადახედვა">
          <InvoiceDocument
            organization={draft.title}
            invoiceNumber={draft.invoiceNumber}
            reportingDate={formatInvoiceDate(draft.reportingDate)}
            sendingDate={formatInvoiceDate(draft.sendingDate)}
            address={draft.issuerAddress}
            identificationNumber={draft.issuerIdentificationNumber}
            bankName={draft.bankName}
            bankCode={draft.bankCode}
            bankAccount={draft.bankAccount}
            companyName={draft.issuerName}
            reportingMonth={formatReportingMonth(draft.reportingMonth)}
            serviceDescription={draft.reportingDescription}
            amount={draft.amount}
            amountInWords={draft.amountInWords}
          />
        </section>
      )}
    </div>
  );
}
