import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.scss";

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "sent"
  | "printed"
  | "draft"
  | "none";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: ReactNode;
}

export function Badge({
  children,
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  ...props
}: BadgeProps) {
  const badgeClassName = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...props} className={badgeClassName} data-variant={variant}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
