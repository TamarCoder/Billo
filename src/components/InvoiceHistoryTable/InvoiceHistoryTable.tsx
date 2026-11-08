import { Pencil, Trash2 } from "lucide-react";
import { parseAmountToMinorUnits } from "@/lib/georgianAmount";
import { Badge } from "@/ui/Badge/Badge";
import { Button } from "@/ui/Button/Button";
import { INVOICE_STATUS_OPTIONS } from "./invoiceStatus";
import type { InvoiceHistoryTableProps } from "./types";
import styles from "./InvoiceHistoryTable.module.scss";

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}.${month}.${year}` : value;
}

function formatReportingPeriod(value: string) {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) return value;
  const lastDay = new Date(year, month, 0).getDate();
  return `01.${String(month).padStart(2, "0")}.${year} - ${String(lastDay).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
}

function formatAmount(value: string) {
  const minorUnits = parseAmountToMinorUnits(value);
  if (minorUnits === null) return "—";
  return `${new Intl.NumberFormat("ka-GE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100)} ₾`;
}

export function InvoiceHistoryTable({
  records,
  emptyMessage,
  onEdit,
  onExportPdf,
  onDelete,
}: InvoiceHistoryTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.invoiceTable} aria-label="ინვოისების ისტორია">
        <thead>
          <tr>
            <th className={styles.dateColumn} scope="col">თარიღი</th>
            <th className={styles.numberColumn} scope="col">ნომერი</th>
            <th className={styles.companyColumn} scope="col">კომპანია</th>
            <th className={styles.periodColumn} scope="col">საანგარიშო პერიოდი</th>
            <th className={styles.amountColumn} scope="col">თანხა</th>
            <th className={styles.statusColumn} scope="col">სტატუსი</th>
            <th className={styles.actionsColumn} scope="col">მოქმედება</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record.id}>
                <td className={styles.dateColumn}>
                  {formatDate(record.invoice.sendingDate)}
                </td>
                <td className={styles.numberColumn}>
                  {record.invoice.invoiceNumber || "—"}
                </td>
                <td className={styles.companyColumn}>
                  <span title={record.invoice.issuerName}>
                    {record.invoice.issuerName || "—"}
                  </span>
                </td>
                <td className={styles.periodColumn}>
                  {formatReportingPeriod(record.invoice.reportingMonth)}
                </td>
                <td className={`${styles.amount} ${styles.amountColumn}`}>
                  {formatAmount(record.invoice.amount)}
                </td>
                <td className={styles.statusColumn}>
                  <Badge
                    variant={INVOICE_STATUS_OPTIONS[record.status].variant}
                    size="sm"
                  >
                    {INVOICE_STATUS_OPTIONS[record.status].label}
                  </Badge>
                </td>
                <td className={styles.actionsColumn}>
                  <div className={styles.rowActions}>
                    <Button
                      className={styles.actionButton}
                      variant="outline"
                      size="sm"
                      aria-label={`ინვოისის № ${record.invoice.invoiceNumber} რედაქტირება`}
                      onClick={() => onEdit(record)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      className={styles.actionButton}
                      variant="outline"
                      size="sm"
                      aria-label={`ინვოისის № ${record.invoice.invoiceNumber} PDF`}
                      onClick={() => onExportPdf(record)}
                    >
                      PDF
                    </Button>
                    <Button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      variant="outline"
                      size="sm"
                      aria-label={`ინვოისის № ${record.invoice.invoiceNumber} წაშლა`}
                      onClick={() => onDelete(record)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className={styles.empty} colSpan={7}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
