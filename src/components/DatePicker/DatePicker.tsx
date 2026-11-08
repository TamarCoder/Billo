import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { useAnchoredPopoverPosition } from "@/hooks/useAnchoredPopover";
import styles from "./DatePicker.module.scss";

const WEEKDAYS = ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"];

export interface DatePickerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  max?: string;
  displayFormat?: "long" | "numeric";
}

function parseDate(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const start = new Date(
    firstDay.getFullYear(),
    firstDay.getMonth(),
    1 - mondayOffset,
  );

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + index,
    );
    return { date, value: toDateValue(date) };
  });
}

function formatSelectedDate(date: Date, displayFormat: "long" | "numeric") {
  if (displayFormat === "numeric") {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}.${date.getFullYear()}`;
  }

  return new Intl.DateTimeFormat("ka-GE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatMonth(date: Date) {
  const label = new Intl.DateTimeFormat("ka-GE", {
    month: "long",
    year: "numeric",
  }).format(date);
  return label.charAt(0).toLocaleUpperCase("ka-GE") + label.slice(1);
}

function isWithinRange(value: string, min?: string, max?: string) {
  return (!min || value >= min) && (!max || value <= max);
}

export function DatePicker({
  id,
  name,
  value,
  onChange,
  required = false,
  placeholder = "აირჩიეთ თარიღი",
  min,
  max,
  displayFormat = "long",
  className,
  disabled,
  ...buttonProps
}: DatePickerProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const calendarId = `${triggerId}-calendar`;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const popoverPosition = useAnchoredPopoverPosition(isOpen, {
    triggerRef,
    popoverRef,
  });
  const [visibleMonth, setVisibleMonth] = useState(
    () =>
      selectedDate
        ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
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
    if (disabled) return;
    setVisibleMonth(
      selectedDate
        ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    );
    setIsOpen((open) => !open);
  };

  const selectDate = (date: Date, dateValue: string) => {
    if (!isWithinRange(dateValue, min, max)) return;
    onChange(dateValue);
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setIsOpen(false);
  };

  const todayValue = toDateValue(new Date());
  const days = getCalendarDays(visibleMonth);
  const buttonClassName = [styles.trigger, className].filter(Boolean).join(" ");

  return (
    <div className={styles.container} ref={containerRef}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        {...buttonProps}
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={buttonClassName}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={calendarId}
        aria-required={required || undefined}
        onClick={openCalendar}
      >
        <span className={selectedDate ? styles.value : styles.placeholder}>
          {selectedDate
            ? formatSelectedDate(selectedDate, displayFormat)
            : placeholder}
        </span>
        <CalendarDays className={styles.triggerIcon} size={18} aria-hidden="true" />
      </button>

      {isOpen &&
        createPortal(
        <div
          ref={popoverRef}
          className={styles.popover}
          style={popoverPosition ?? { visibility: "hidden" }}
          id={calendarId}
          role="dialog"
          aria-label="თარიღის არჩევა"
        >
          <div className={styles.calendarHeader}>
            <button
              type="button"
              className={styles.monthButton}
              aria-label="წინა თვე"
              onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
            >
              <ChevronLeft size={18} />
            </button>
            <div className={styles.monthTitle} aria-live="polite">
              {formatMonth(visibleMonth)}
            </div>
            <button
              type="button"
              className={styles.monthButton}
              aria-label="შემდეგი თვე"
              onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.calendarGrid} role="grid">
            {WEEKDAYS.map((weekday) => (
              <span className={styles.weekday} role="columnheader" key={weekday}>
                {weekday}
              </span>
            ))}
            {days.map(({ date, value: dateValue }) => {
              const isSelected = dateValue === value;
              const isCurrentMonth =
                date.getMonth() === visibleMonth.getMonth();
              const isDisabled = !isWithinRange(dateValue, min, max);
              const dayClassName = [
                styles.day,
                !isCurrentMonth && styles.outsideMonth,
                isSelected && styles.selected,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  type="button"
                  className={dayClassName}
                  key={dateValue}
                  role="gridcell"
                  aria-label={new Intl.DateTimeFormat("ka-GE", {
                    dateStyle: "full",
                  }).format(date)}
                  aria-pressed={isSelected}
                  disabled={isDisabled}
                  onClick={() => selectDate(date, dateValue)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className={styles.calendarFooter}>
            <span className={styles.selectedLabel}>
              {selectedDate
                ? formatSelectedDate(selectedDate, displayFormat)
                : "თარიღი არ არის არჩეული"}
            </span>
            <button
              type="button"
              className={styles.todayButton}
              disabled={!isWithinRange(todayValue, min, max)}
              onClick={() => selectDate(new Date(), todayValue)}
            >
              დღეს
            </button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
