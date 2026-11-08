import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAnchoredPopoverPosition } from "@/hooks/useAnchoredPopover";
import {
  formatGeorgianMonthYear,
  GEORGIAN_MONTHS,
} from "@/lib/georgianMonth";
import styles from "./MonthYearPicker.module.scss";

export interface MonthYearPickerProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

function parseMonthYear(value: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  return year > 0 && month >= 1 && month <= 12 ? { year, month } : null;
}

function formatMonthYear(value: string) {
  return formatGeorgianMonthYear(value);
}

export function MonthYearPicker({
  id,
  name,
  value,
  onChange,
  placeholder = "აირჩიეთ თვე და წელი",
  className,
  "aria-label": ariaLabel,
  required = false,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: MonthYearPickerProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const popoverId = `${triggerId}-calendar`;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const selectedMonth = parseMonthYear(value);
  const [isOpen, setIsOpen] = useState(false);
  const popoverPosition = useAnchoredPopoverPosition(isOpen, {
    triggerRef,
    popoverRef,
  });
  const [visibleYear, setVisibleYear] = useState(
    () => selectedMonth?.year ?? new Date().getFullYear(),
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target) &&
        !popoverRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const openCalendar = () => {
    setVisibleYear(selectedMonth?.year ?? new Date().getFullYear());
    setIsOpen((open) => !open);
  };

  const selectMonth = (monthIndex: number) => {
    onChange(`${visibleYear}-${String(monthIndex + 1).padStart(2, "0")}`);
    setIsOpen(false);
  };

  const currentMonth = new Date();
  const currentMonthValue = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1,
  ).padStart(2, "0")}`;

  return (
    <div className={styles.container} ref={containerRef}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={[styles.trigger, className].filter(Boolean).join(" ")}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        aria-label={ariaLabel}
        aria-required={required || undefined}
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        onClick={openCalendar}
      >
        <span className={selectedMonth ? styles.value : styles.placeholder}>
          {selectedMonth ? formatMonthYear(value) : placeholder}
        </span>
        <CalendarDays size={18} className={styles.triggerIcon} aria-hidden="true" />
      </button>

      {isOpen &&
        createPortal(
        <div
          ref={popoverRef}
          className={styles.popover}
          style={popoverPosition ?? { visibility: "hidden" }}
          id={popoverId}
          role="dialog"
          aria-label="საანგარიშო თვის არჩევა"
        >
          <div className={styles.header}>
            <button
              type="button"
              className={styles.yearButton}
              aria-label="წინა წელი"
              onClick={() => setVisibleYear((year) => year - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <div className={styles.yearTitle} aria-live="polite">
              {visibleYear}
            </div>
            <button
              type="button"
              className={styles.yearButton}
              aria-label="შემდეგი წელი"
              onClick={() => setVisibleYear((year) => year + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.monthGrid} role="grid" aria-label="თვეები">
            {GEORGIAN_MONTHS.map((month, index) => {
              const monthValue = `${visibleYear}-${String(index + 1).padStart(2, "0")}`;
              const isSelected = monthValue === value;

              return (
                <button
                  type="button"
                  className={[
                    styles.month,
                    isSelected && styles.selected,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={monthValue}
                  role="gridcell"
                  aria-pressed={isSelected}
                  onClick={() => selectMonth(index)}
                >
                  {month}
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <span className={styles.selectedLabel}>
              {selectedMonth ? formatMonthYear(value) : "თვე არ არის არჩეული"}
            </span>
            <button
              type="button"
              className={styles.currentButton}
              onClick={() => {
                setVisibleYear(currentMonth.getFullYear());
                onChange(currentMonthValue);
                setIsOpen(false);
              }}
            >
              მიმდინარე თვე
            </button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
