import type { TextareaHTMLAttributes } from "react";
import type { ControlSize, FieldStatus } from "@/ui/Input/Input";
import styles from "./Textarea.module.scss";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: ControlSize;
  status?: FieldStatus;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export function Textarea({
  className,
  size = "md",
  status = "default",
  resize = "vertical",
  "aria-invalid": ariaInvalid,
  ...props
}: TextareaProps) {
  const textareaClassName = [
    styles.textarea,
    styles[size],
    styles[status],
    styles[`resize-${resize}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <textarea
      {...props}
      className={textareaClassName}
      aria-invalid={ariaInvalid ?? (status === "error" || undefined)}
      data-status={status}
    />
  );
}
