import type { ComponentType } from "react";
import {
  InvoiceDocument,
  type InvoiceDocumentProps,
} from "@/components/InvoiceDocument/InvoiceDocument";
import { InvoiceForm } from "@/components/InvoiceForm/InvoiceForm";
import type { InvoiceFormProps } from "@/components/InvoiceForm/types";

// Each organization sends its own invoice sample. For it we build, in code:
// - form: the fields of "ინვოისის მომზადება" for that invoice
// - document: the printed invoice in that organization's layout
// Add the template here under a key, then the admin sends it for review and publishes it
// in BilloAdmin. The organization only ever sees its own keys.
export interface InvoiceTemplate {
  title: string;
  form: ComponentType<InvoiceFormProps>;
  document: ComponentType<InvoiceDocumentProps>;
}

export const INVOICE_TEMPLATES: Record<string, InvoiceTemplate> = {
  // დავით ტატიშვილის ჯანმრთელობის ცენტრი (ს/კ 405310612).
  tatishvili: {
    title: "ინვოისის ფორმა — ტატიშვილის ჯანმრთელობის ცენტრი",
    form: InvoiceForm,
    document: InvoiceDocument,
  },
};

// Invoices saved before templates existed were all made with this layout.
export const LEGACY_TEMPLATE_KEY = "tatishvili";

// Templates this organization may use: only assigned keys that exist in code.
export function templatesFor(assigned: string[] | undefined): string[] {
  return (assigned ?? []).filter((key) => key in INVOICE_TEMPLATES);
}

// The template an existing invoice must be drawn with.
export function templateOfInvoice(templateKey: string | undefined): InvoiceTemplate {
  return INVOICE_TEMPLATES[templateKey ?? LEGACY_TEMPLATE_KEY] ?? INVOICE_TEMPLATES[LEGACY_TEMPLATE_KEY];
}
