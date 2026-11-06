import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/ui/IconButton/IconButton";
import styles from "./Pagination.module.scss";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  className?: string;
  "aria-label"?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  className,
  "aria-label": ariaLabel = "გვერდების ნავიგაცია",
}: PaginationProps) {
  const pageCount = Math.max(1, Math.floor(totalPages));
  const page = Math.min(pageCount, Math.max(1, Math.floor(currentPage)));
  const containerClassName = [styles.pagination, className]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={containerClassName} aria-label={ariaLabel}>
      {totalItems !== undefined && (
        <span className={styles.total}>
          სულ {totalItems} ჩანაწერი
        </span>
      )}
      <div className={styles.controls}>
        <span className={styles.page} aria-live="polite">
          {page} / {pageCount}
        </span>
        <IconButton
          icon={<ChevronLeft size={18} />}
          aria-label="წინა გვერდი"
          size="sm"
          variant="ghost"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        <IconButton
          icon={<ChevronRight size={18} />}
          aria-label="შემდეგი გვერდი"
          size="sm"
          variant="ghost"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </nav>
  );
}
