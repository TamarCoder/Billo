import type { ComponentType } from "react";
import {
  InvoiceDocument,
  type InvoiceDocumentProps,
} from "@/components/InvoiceDocument/InvoiceDocument";

// Invoice templates built in code. To add a client's template:
// 1. Create its component (it takes InvoiceDocumentProps).
// 2. Add it here under a key, e.g. "tatishvili".
// 3. Assign the key to the organization:
//    PUT /api/admin/organizations/:id/invoice-templates  { "templates": ["tatishvili"] }
export interface InvoiceTemplate {
  title: string;
  component: ComponentType<InvoiceDocumentProps>;
}

export const INVOICE_TEMPLATES: Record<string, InvoiceTemplate> = {
  // დავით ტატიშვილის ჯანმრთელობის ცენტრი. This is the layout the invoice page already uses.
  tatishvili: { title: "ინვოისის ფორმა — ტატიშვილის ჯანმრთელობის ცენტრი", component: InvoiceDocument },
};

// Templates this organization may see: only assigned keys that exist in code.
export function templatesFor(assigned: string[] | undefined): string[] {
  return (assigned ?? []).filter((key) => key in INVOICE_TEMPLATES);
}
