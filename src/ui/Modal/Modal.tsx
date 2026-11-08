import { X } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./Modal.module.scss";

export interface ModalProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  // "page": covers the whole app (login). "dim": opens on top of the current page.
  backdrop?: "page" | "dim";
  size?: "md" | "lg";
  onClose?: () => void;
}

export function Modal({
  title,
  description,
  icon,
  footer,
  children,
  backdrop = "page",
  size = "md",
  onClose,
}: ModalProps) {
  return (
    <div
      className={`${styles.overlay} ${styles[backdrop]}`}
      onKeyDown={(event) => event.key === "Escape" && onClose?.()}
    >
      <section
        className={size === "lg" ? `${styles.dialog} ${styles.lg}` : styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {onClose && (
          <button type="button" className={styles.close} onClick={onClose} aria-label="დახურვა">
            <X size={18} />
          </button>
        )}
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <h1 id="modal-title" className={styles.title}>
          {title}
        </h1>
        {description && <p className={styles.description}>{description}</p>}
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </section>
    </div>
  );
}
