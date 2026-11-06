import { ChevronDown } from "lucide-react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import type { ControlSize, FieldStatus } from "@/ui/Input/Input";
import styles from "./Select.module.scss";

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: ControlSize;
  status?: FieldStatus;
  wrapperClassName?: string;
  children: ReactNode;
}

export function Select({
  className,
  wrapperClassName,
  size = "md",
  status = "default",
  "aria-invalid": ariaInvalid,
  children,
  ...props
}: SelectProps) {
  const selectClassName = [
    styles.select,
    styles[size],
    styles[status],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const containerClassName = [styles.wrapper, wrapperClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={containerClassName}>
      <select
        {...props}
        className={selectClassName}
        aria-invalid={ariaInvalid ?? (status === "error" || undefined)}
        data-status={status}
      >
        {children}
      </select>
      <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
    </span>
  );
}
