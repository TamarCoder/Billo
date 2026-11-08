import type { ReactNode } from "react";
import type { InvoiceDraft, Company } from "@/types/invoice";

export interface InvoiceFormProps {
  initialValues: InvoiceDraft;
  companies: Company[];
  isSaved: boolean;
  saveError: string;
  pdfError: string;
  pdfSaved: boolean;
  onDraftChange: <Field extends keyof InvoiceDraft>(
    field: Field,
    value: InvoiceDraft[Field],
  ) => void;
  onSubmit: (draft: InvoiceDraft) => void;
  onReset: () => void;
  onPrint: () => void;
  onExportPdf: () => void;
}

export interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}
