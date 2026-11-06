import type { InvoiceStatus } from "@/types/invoice";

export const INVOICE_STATUS_OPTIONS: Record<
  InvoiceStatus,
  {
    label: string;
    variant: "neutral" | "success" | "warning" | "info";
  }
> = {
  none: { label: "არ არის", variant: "neutral" },
  draft: { label: "დრაფტი", variant: "warning" },
  sent: { label: "გაგზავნილი", variant: "success" },
  printed: { label: "დაბეჭდილი", variant: "info" },
};
