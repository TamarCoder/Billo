import { Badge, type BadgeVariant } from "@/ui/Badge/Badge";
import type { InvoiceFormStatus } from "@/types/api";

const LABELS: Record<InvoiceFormStatus, { text: string; variant: BadgeVariant }> = {
  submitted: { text: "გაგზავნილი", variant: "neutral" },
  in_progress: { text: "მზადდება", variant: "info" },
  review: { text: "შესამოწმებელი", variant: "warning" },
  approved: { text: "დადასტურებული", variant: "info" },
  changes_requested: { text: "შესწორება სჭირდება", variant: "danger" },
  live: { text: "აქტიური", variant: "success" },
};

export function FormStatusBadge({ status = "submitted" }: { status?: InvoiceFormStatus }) {
  const { text, variant } = LABELS[status] ?? LABELS.submitted;
  return (
    <Badge variant={variant} size="sm">
      {text}
    </Badge>
  );
}
