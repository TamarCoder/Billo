import { useState } from "react";
import { InvoiceDocument } from "@/components/InvoiceDocument/InvoiceDocument";
import { InvoiceForm } from "@/components/InvoiceForm/InvoiceForm";
import { useInvoicePageState } from "@/hooks/useInvoicePageState";
import { useLoadInvoicePage } from "@/hooks/useLoadInvoicePage";
import { useCompanies } from "@/hooks/api/useCompanies";
import { useInvoices } from "@/hooks/api/useInvoices";
import { useOrganizationSettings } from "@/hooks/api/useOrganizationSettings";
import { useInvoiceMutations } from "@/hooks/api/useInvoiceMutations";
import { formatGeorgianMonthYear } from "@/lib/georgianMonth";
import {
  DEFAULT_ORGANIZATION_SETTINGS,
  INVOICE_EDIT_ID_KEY,
} from "@/lib/invoiceStorage";
import type { InvoiceDraft } from "@/types/invoice";
import styles from "./page.module.scss";

function formatInvoiceDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}.${month}.${year}` : value;
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
  const {
    data: companies = [],
    error: companiesLoadError,
  } = useCompanies();
  const {
    data: records = [],
    error: invoicesLoadError,
    isLoading: invoicesLoading,
  } = useInvoices();
  const {
    data: settings = DEFAULT_ORGANIZATION_SETTINGS,
    error: settingsLoadError,
    isLoading: settingsLoading,
  } = useOrganizationSettings();
  const { createInvoice, updateInvoice, changeInvoiceStatus } =
    useInvoiceMutations();
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
    records,
    settings,
    isReady: !invoicesLoading && !settingsLoading && !invoicesLoadError && !settingsLoadError,
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

  const saveDraft = async (values: InvoiceDraft) => {
    setSaveError("");
    try {
      setDraft(values);
      const savedRecord = recordId
        ? await updateInvoice(recordId, values)
        : await createInvoice(values);
      setRecordId(savedRecord.id);
      window.localStorage.removeItem(INVOICE_EDIT_ID_KEY);
      setIsSaved(true);
      setSaveError("");
      setPdfError("");
      setPdfSaved(false);
    } catch (error) {
      setIsSaved(false);
      setSaveError(
        error instanceof Error
          ? error.message
          : "ინვოისის შენახვა ვერ მოხერხდა. სცადეთ ხელახლა.",
      );
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

  const markAsPrinted = async () => {
    if (!recordId) return;
    await changeInvoiceStatus(recordId, { status: "printed" });
  };

  const exportPdf = async () => {
    setPdfError("");
    setPdfSaved(false);
    try {
      if (!window.electron) {
        window.print();
        await markAsPrinted();
        return;
      }

      const result = await window.electron.exportInvoicePdf();
      setPdfSaved(result.status === "saved");
      if (result.status === "saved") await markAsPrinted();
    } catch (error) {
      setPdfError(
        error instanceof Error
          ? error.message
          : "PDF-ის ექსპორტი ვერ მოხერხდა. სცადეთ ხელახლა.",
      );
    }
  };

  const printInvoice = async () => {
    window.print();
    try {
      await markAsPrinted();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "ინვოისის სტატუსის განახლება ვერ მოხერხდა.",
      );
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
        saveError={
          companiesLoadError
            ? companiesLoadError instanceof Error
              ? companiesLoadError.message
              : "სადაზღვევო კომპანიების ჩატვირთვა ვერ მოხერხდა."
            : invoicesLoadError
              ? invoicesLoadError instanceof Error
                ? invoicesLoadError.message
                : "ინვოისების ჩატვირთვა ვერ მოხერხდა."
              : settingsLoadError
                ? settingsLoadError instanceof Error
                  ? settingsLoadError.message
                  : "ორგანიზაციის პარამეტრების ჩატვირთვა ვერ მოხერხდა."
                : saveError
        }
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
            reportingMonth={formatGeorgianMonthYear(draft.reportingMonth)}
            serviceDescription={draft.reportingDescription}
            amount={draft.amount}
            amountInWords={draft.amountInWords}
          />
        </section>
      )}
    </div>
  );
}
