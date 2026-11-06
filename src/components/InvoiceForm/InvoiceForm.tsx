import type { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { FileDown, Printer } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import { MonthYearPicker } from "@/components/MonthYearPicker/MonthYearPicker";
import { Badge } from "@/ui/Badge/Badge";
import { Button } from "@/ui/Button/Button";
import { Input } from "@/ui/Input/Input";
import { Select } from "@/ui/Select/Select";
import type { InvoiceDraft } from "@/types/invoice";
import { invoiceDraftResolver } from "./invoiceDraftResolver";
import type { FieldProps, InvoiceFormProps } from "./types";
import styles from "./InvoiceForm.module.scss";

function Field({ id, label, error, children }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className={styles.fieldError} id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function InvoiceForm({
  initialValues,
  companies,
  isSaved,
  saveError,
  pdfError,
  pdfSaved,
  onDraftChange,
  onSubmit,
  onReset,
  onPrint,
  onExportPdf,
}: InvoiceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceDraft>({
    defaultValues: initialValues,
    resolver: invoiceDraftResolver,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const registerField = (name: keyof InvoiceDraft) =>
    register(name, {
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        onDraftChange(name, event.currentTarget.value);
      },
    });

  return (
    <Card
      className={styles.formCard}
      heading="ინვოისის მომზადება"
      actions={
        <Badge variant={isSaved ? "success" : "warning"} dot>
          {isSaved ? "შენახულია" : "დრაფტი"}
        </Badge>
      }
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.formColumns}>
          <fieldset className={styles.formSection}>
            <legend>ინვოისის მონაცემები</legend>
            <Field
              id="invoice-title"
              label="ორგანიზაცია"
              error={errors.title?.message}
            >
              <Input
                id="invoice-title"
                autoComplete="organization"
                status={errors.title ? "error" : "default"}
                aria-describedby={errors.title ? "invoice-title-error" : undefined}
                {...registerField("title")}
              />
            </Field>
            <div className={styles.fieldGrid}>
              <Field
                id="issuer-address"
                label="მისამართი"
                error={errors.issuerAddress?.message}
              >
                <Input
                  id="issuer-address"
                  autoComplete="street-address"
                  status={errors.issuerAddress ? "error" : "default"}
                  aria-describedby={
                    errors.issuerAddress ? "issuer-address-error" : undefined
                  }
                  {...registerField("issuerAddress")}
                />
              </Field>
              <Field
                id="issuer-identification-number"
                label="ორგანიზაციის საიდენტიფიკაციო კოდი"
                error={errors.issuerIdentificationNumber?.message}
              >
                <Input
                  id="issuer-identification-number"
                  status={errors.issuerIdentificationNumber ? "error" : "default"}
                  aria-describedby={
                    errors.issuerIdentificationNumber
                      ? "issuer-identification-number-error"
                      : undefined
                  }
                  {...registerField("issuerIdentificationNumber")}
                />
              </Field>
            </div>
            <div className={styles.bankGrid}>
              <Field
                id="bank-name"
                label="ბანკი"
                error={errors.bankName?.message}
              >
                <Input
                  id="bank-name"
                  autoComplete="off"
                  status={errors.bankName ? "error" : "default"}
                  aria-describedby={errors.bankName ? "bank-name-error" : undefined}
                  {...registerField("bankName")}
                />
              </Field>
              <Field
                id="bank-code"
                label="ბანკის კოდი"
                error={errors.bankCode?.message}
              >
                <Input
                  id="bank-code"
                  status={errors.bankCode ? "error" : "default"}
                  aria-describedby={errors.bankCode ? "bank-code-error" : undefined}
                  {...registerField("bankCode")}
                />
              </Field>
              <Field
                id="bank-account"
                label="ანგარიშის ნომერი"
                error={errors.bankAccount?.message}
              >
                <Input
                  id="bank-account"
                  status={errors.bankAccount ? "error" : "default"}
                  aria-describedby={
                    errors.bankAccount ? "bank-account-error" : undefined
                  }
                  {...registerField("bankAccount")}
                />
              </Field>
            </div>
            <Controller
              control={control}
              name="issuerName"
              render={({ field }) => (
                <Field
                  id="issuer-name"
                  label="კომპანიის დასახელება"
                  error={errors.issuerName?.message}
                >
                  <Select
                    {...field}
                    id="issuer-name"
                    status={errors.issuerName ? "error" : "default"}
                    aria-describedby={
                      errors.issuerName ? "issuer-name-error" : undefined
                    }
                    onChange={(event) => {
                      field.onChange(event);
                      onDraftChange("issuerName", event.currentTarget.value);
                    }}
                  >
                    <option value="">აირჩიეთ კომპანია</option>
                    {companies
                      .filter((company) => company.name.trim())
                      .map((company) => (
                        <option key={company.id} value={company.name}>
                          {company.name}
                        </option>
                      ))}
                  </Select>
                </Field>
              )}
            />
            <div className={styles.companyName}>დასახელება</div>
            <div className={styles.fieldGrid}>
              <Controller
                control={control}
                name="reportingMonth"
                render={({ field }) => (
                  <Field
                    id="reporting-month"
                    label="საანგარიშო თვე"
                    error={errors.reportingMonth?.message}
                  >
                    <MonthYearPicker
                      id="reporting-month"
                      value={field.value}
                      required
                      aria-invalid={Boolean(errors.reportingMonth)}
                      aria-describedby={
                        errors.reportingMonth
                          ? "reporting-month-error"
                          : undefined
                      }
                      onChange={(value) => {
                        field.onChange(value);
                        onDraftChange("reportingMonth", value);
                      }}
                    />
                  </Field>
                )}
              />
              <Field
                id="reporting-description"
                label="მომსახურება"
                error={errors.reportingDescription?.message}
              >
                <Input
                  id="reporting-description"
                  {...registerField("reportingDescription")}
                />
              </Field>
            </div>
          </fieldset>
          <aside className={styles.rightColumn} aria-label="ანგარიშ-ფაქტურა">
            <Field
              id="invoice-number"
              label="ანგარიშ-ფაქტურა"
              error={errors.invoiceNumber?.message}
            >
              <Input
                id="invoice-number"
                placeholder="შეიყვანეთ ნომერი"
                {...registerField("invoiceNumber")}
              />
            </Field>
            <Controller
              control={control}
              name="reportingDate"
              render={({ field }) => (
                <Field
                  id="reporting-date"
                  label="საანგარიშო პერიოდი"
                  error={errors.reportingDate?.message}
                >
                  <DatePicker
                    id="reporting-date"
                    value={field.value}
                    displayFormat="numeric"
                    required
                    aria-invalid={Boolean(errors.reportingDate)}
                    aria-describedby={
                      errors.reportingDate ? "reporting-date-error" : undefined
                    }
                    onChange={(value) => {
                      field.onChange(value);
                      onDraftChange("reportingDate", value);
                    }}
                  />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="sendingDate"
              render={({ field }) => (
                <Field
                  id="sending-date"
                  label="გაგზავნის თარიღი"
                  error={errors.sendingDate?.message}
                >
                  <DatePicker
                    id="sending-date"
                    value={field.value}
                    displayFormat="numeric"
                    required
                    aria-invalid={Boolean(errors.sendingDate)}
                    aria-describedby={
                      errors.sendingDate ? "sending-date-error" : undefined
                    }
                    onChange={(value) => {
                      field.onChange(value);
                      onDraftChange("sendingDate", value);
                    }}
                  />
                </Field>
              )}
            />
            <Field
              id="invoice-amount"
              label="თანხა"
              error={errors.amount?.message}
            >
              <Input
                id="invoice-amount"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                status={errors.amount ? "error" : "default"}
                aria-describedby={errors.amount ? "invoice-amount-error" : undefined}
                {...registerField("amount")}
              />
            </Field>
          </aside>
        </div>

        <Field
          id="amount-in-words"
          label="თანხა სიტყვიერად"
          error={errors.amountInWords?.message}
        >
          <Input id="amount-in-words" {...registerField("amountInWords")} />
        </Field>

        {saveError && (
          <p className={styles.error} role="alert">
            {saveError}
          </p>
        )}
        <div className={styles.actions}>
          <div className={styles.actionGroup}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leadingIcon={<Printer size={16} />}
              disabled={!isSaved}
              onClick={onPrint}
            >
              ბეჭდვა
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leadingIcon={<FileDown size={16} />}
              disabled={!isSaved}
              onClick={onExportPdf}
            >
              PDF ექსპორტი
            </Button>
            {pdfSaved && (
              <span className={styles.pdfSuccess} role="status">
                PDF შენახულია
              </span>
            )}
            {pdfError && (
              <span className={styles.error} role="alert">
                {pdfError}
              </span>
            )}
          </div>
          <div className={styles.actionGroup}>
            <Button type="submit" variant="success" size="sm" disabled={isSubmitting}>
              შენახვა
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onReset}
            >
              გაუქმება
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
