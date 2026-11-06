import type { FieldError, Resolver } from "react-hook-form";
import type { InvoiceDraft } from "@/types/invoice";

const requiredFields = {
  title: "ორგანიზაციის სახელი სავალდებულოა.",
  issuerAddress: "მისამართი სავალდებულოა.",
  issuerIdentificationNumber: "საიდენტიფიკაციო კოდი სავალდებულოა.",
  bankName: "ბანკის სახელი სავალდებულოა.",
  bankCode: "ბანკის კოდი სავალდებულოა.",
  bankAccount: "ანგარიშის ნომერი სავალდებულოა.",
  issuerName: "აირჩიეთ სადაზღვევო კომპანია.",
  reportingMonth: "აირჩიეთ საანგარიშო თვე.",
  reportingDate: "აირჩიეთ საანგარიშო პერიოდის თარიღი.",
  sendingDate: "აირჩიეთ გაგზავნის თარიღი.",
  amount: "თანხა სავალდებულოა.",
} satisfies Partial<Record<keyof InvoiceDraft, string>>;

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export const invoiceDraftResolver: Resolver<InvoiceDraft> = async (values) => {
  const errors: Partial<Record<keyof InvoiceDraft, FieldError>> = {};
  const setError = (field: keyof InvoiceDraft, message: string) => {
    errors[field] = { type: "validate", message };
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    const key = field as keyof InvoiceDraft;
    if (!values[key].trim()) setError(key, message);
  }

  if (
    values.reportingMonth.trim() &&
    !/^\d{4}-(0[1-9]|1[0-2])$/u.test(values.reportingMonth)
  ) {
    setError("reportingMonth", "საანგარიშო თვე არასწორია.");
  }
  if (values.reportingDate.trim() && !isValidDate(values.reportingDate)) {
    setError("reportingDate", "საანგარიშო პერიოდის თარიღი არასწორია.");
  }
  if (values.sendingDate.trim() && !isValidDate(values.sendingDate)) {
    setError("sendingDate", "გაგზავნის თარიღი არასწორია.");
  }
  if (values.amount.trim()) {
    const amount = Number(values.amount);
    if (!Number.isFinite(amount) || amount < 0) {
      setError("amount", "თანხა არ უნდა იყოს ნულზე ნაკლები.");
    }
  }

  if (Object.keys(errors).length > 0) {
    return { values: {}, errors };
  }

  return { values, errors: {} };
};
