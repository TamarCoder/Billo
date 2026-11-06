import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

export type ControlSize = "sm" | "md" | "lg";
export type FieldStatus = "default" | "success" | "warning" | "error";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: ControlSize;
  status?: FieldStatus;
}

export function Input({
  className,
  size = "md",
  status = "default",
  "aria-invalid": ariaInvalid,
  ...props
}: InputProps) {
  const inputClassName = [
    styles.input,
    styles[size],
    styles[status],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      {...props}
      className={inputClassName}
      aria-invalid={ariaInvalid ?? (status === "error" || undefined)}
      data-status={status}
    />
  );
}
