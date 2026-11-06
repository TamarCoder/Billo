import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.scss";

export type CardVariant = "glass" | "solid" | "elevated";
export type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  heading?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  children?: ReactNode;
}

export function Card({
  heading,
  description,
  actions,
  footer,
  variant = "glass",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const cardClassName = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const hasHeader = heading !== undefined || description !== undefined || actions !== undefined;

  return (
    <div {...props} className={cardClassName}>
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.headingGroup}>
            {heading !== undefined && (
              <div className={styles.heading}>{heading}</div>
            )}
            {description !== undefined && (
              <div className={styles.description}>{description}</div>
            )}
          </div>
          {actions !== undefined && (
            <div className={styles.actions}>{actions}</div>
          )}
        </div>
      )}
      {children !== undefined && (
        <div className={styles.body}>{children}</div>
      )}
      {footer !== undefined && (
        <div className={styles.footer}>{footer}</div>
      )}
    </div>
  );
}
