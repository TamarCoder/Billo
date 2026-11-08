import type { MouseEventHandler, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./AsideButton.module.scss";

interface AsideButtonProps {
  title: string;
  icon: ReactNode;
  to?: string;
  className?: string;
  // Also active on any address that starts with this prefix.
  activePrefix?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function AsideButton({
  title,
  icon,
  to,
  className,
  activePrefix,
  onClick,
}: AsideButtonProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive =
    (to !== undefined && pathname === to) ||
    (activePrefix !== undefined && pathname.startsWith(activePrefix));

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (to) navigate(to);
    onClick?.(event);
  };

  const buttonClassName = [
    styles.button,
    isActive && styles.active,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span>{title}</span>
    </button>
  );
}
