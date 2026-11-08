import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
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
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Escape closes from anywhere; Tab stays inside the dialog; focus returns on close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    if (!dialog.contains(document.activeElement)) dialog.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onCloseRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  return (
    <div className={`${styles.overlay} ${styles[backdrop]}`}>
      <section
        ref={dialogRef}
        tabIndex={-1}
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
