import type { InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.scss";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={[styles.checkbox, className].filter(Boolean).join(" ")}>
      <input {...props} type="checkbox" className={styles.input} />
      <span>{label}</span>
    </label>
  );
}
