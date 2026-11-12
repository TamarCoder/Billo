import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAccount } from "@/hooks/api/useAccount";
import { INVOICE_TEMPLATES, templatesFor } from "@/invoiceTemplates/registry";
import { useInvoicePageState } from "@/hooks/useInvoicePageState";
import { useLoadInvoicePage } from "@/hooks/useLoadInvoicePage";
import { useCompanies } from "@/hooks/api/useCompanies";
import { useInvoices } from "@/hooks/api/useInvoices";
import { useIssuers } from "@/hooks/api/useIssuers";
import { useInvoiceMutations } from "@/hooks/api/useInvoiceMutations";
import { formatGeorgianMonthYear } from "@/lib/georgianMonth";
import { EMPTY_INVOICE_NUMBER } from "@/lib/invoiceNumber";
import {
  EMPTY_ORGANIZATION_SETTINGS,
  INVOICE_EDIT_ID_KEY,
} from "@/lib/invoiceStorage";
import type { InvoiceDraft } from "@/types/invoice";
import styles from "./page.module.scss";

function formatInvoiceDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}.${month}.${year}` : value;
}

function getInitialDraft(): InvoiceDraft {
  return {
    ...EMPTY_ORGANIZATION_SETTINGS,
    invoiceNumber: EMPTY_INVOICE_NUMBER,
    reportingDate: "",
    sendingDate: "",
    amount: "",
    amountInWords: "",
    reportingMonth: "",
    reportingDescription: "სამედიცინო მომსახურეობა, ამბულატორია",
    issuerName: "",
  };
}

export default function InvoicePage() {
  const { issuerId } = useParams();
  const { data: account } = useAccount();
  const templates = templatesFor(account?.invoiceTemplates);
  const {
    data: companies = [],
    error: companiesLoadError,
    isLoading: companiesLoading,
  } = useCompanies();
  const {
    data: records = [],
    error: invoicesLoadError,
    isLoading: invoicesLoading,
  } = useInvoices();
  const {
    data: issuers,
    error: issuersLoadError,
    isLoading: settingsLoading,
  } = useIssuers();
  // Without an id in the address, the form opens for the primary organization.
  const issuer = issuerId
    ? issuers?.find((item) => item.id === issuerId)
    : (issuers?.find((item) => item.isPrimary) ?? issuers?.[0]);
  const settingsLoadError =
    issuersLoadError ??
    (issuers && !issuer ? new Error("ორგანიზაცია ვერ მოიძებნა.") : undefined);
  const settings = useMemo(() => {
    if (!issuer) return EMPTY_ORGANIZATION_SETTINGS;
    return {
      title: issuer.title,
      issuerAddress: issuer.issuerAddress,
      issuerIdentificationNumber: issuer.issuerIdentificationNumber,
      bankName: issuer.bankName,
      bankCode: issuer.bankCode,
      bankAccount: issuer.bankAccount,
    };
  }, [issuer]);
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
    // An invoice being edited already carries its issuer, so a missing organization must not block it.
    isReady:
      !invoicesLoading &&
      !settingsLoading &&
      !invoicesLoadError &&
      !issuersLoadError,
    setFormResetKey,
    setDraft,
    setRecordId,
    setIsSaved,
    setError: setSaveError,
  });

  // An invoice being edited keeps its template; a new one uses the chosen template.
  const templateKey =
    draft.templateKey && templates.includes(draft.templateKey)
      ? draft.templateKey
      : templates[0];
  const template = templateKey ? INVOICE_TEMPLATES[templateKey] : undefined;

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
      const withTemplate = { ...values, templateKey };
      setDraft(withTemplate);
      const savedRecord = recordId
        ? await updateInvoice(recordId, withTemplate)
        : await createInvoice(withTemplate);
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
    setDraft({ ...getInitialDraft(), ...settings });
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

  // A sent or printed invoice is never changed; saving creates a new version.
  const openStatus = records.find((record) => record.id === recordId)?.status;
  const isLockedVersion = openStatus === "sent" || openStatus === "printed";

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <span>ინვოისის ფორმა</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">ინვოისის მომზადება</span>
      </nav>

      {isLockedVersion && (
        <p className={styles.lockedNotice} role="status">
          ეს ინვოისი {openStatus === "sent" ? "გაგზავნილია" : "დაბეჭდილია"} და
          აღარ შეიცვლება. შენახვისას შეიქმნება ახალი ვერსია.
        </p>
      )}

      {account && !template ? (
        <p className={styles.lockedNotice} role="status">
          თქვენი ინვოისის ფორმა ჯერ არ არის მზად. გაგვიგზავნეთ თქვენი ინვოისის
          ნიმუში <Link to="/forms">ფორმების გვერდიდან</Link>. ფორმა აქ
          გამოჩნდება, როცა მას ავაწყობთ და დაადასტურებთ.
        </p>
      ) : !template ? null : (
        <>
          {templates.length > 1 && (
            <label className={styles.templatePicker}>
              ინვოისის ფორმა
              <select
                value={templateKey}
                onChange={(event) =>
                  updateDraft("templateKey", event.target.value)
                }
              >
                {templates.map((key) => (
                  <option key={key} value={key}>
                    {INVOICE_TEMPLATES[key].title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <template.form
            key={formResetKey}
            initialValues={draft}
            companies={companies}
            companiesReady={!companiesLoading && !companiesLoadError}
            isSaved={isSaved}
            saveError={
              companiesLoadError
                ? companiesLoadError instanceof Error
                  ? companiesLoadError.message
                  : "კომპანიების ჩატვირთვა ვერ მოხერხდა."
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
            <section
              className={styles.invoicePreview}
              aria-label="ინვოისის გადახედვა"
            >
              <template.document
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
        </>
      )}
    </div>
  );
}
