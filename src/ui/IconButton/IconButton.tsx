import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.scss";

export type IconButtonVariant = "default" | "ghost" | "danger";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export function IconButton({
  icon,
  className,
  variant = "default",
  size = "md",
  type = "button",
  ...props
}: IconButtonProps) {
  const buttonClassName = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...props} type={type} className={buttonClassName}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
