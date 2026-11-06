import type { InvoiceRecord } from "@/types/invoice";

export interface InvoiceHistoryTableProps {
  records: InvoiceRecord[];
  emptyMessage: string;
  onEdit: (record: InvoiceRecord) => void;
  onExportPdf: (record: InvoiceRecord) => void;
  onDelete: (record: InvoiceRecord) => void;
}
