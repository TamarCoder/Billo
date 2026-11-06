import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "./Dropdown.module.scss";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  "aria-label": string;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === value)),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const listboxId = `${ariaLabel.replace(/\s+/gu, "-")}-options`;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  const openMenu = (index = options.findIndex((option) => option.value === value)) => {
    setActiveIndex(Math.max(0, index));
    setIsOpen(true);
  };

  const selectOption = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
        return;
      }
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) =>
        (index + direction + options.length) % options.length,
      );
    } else if (event.key === "Home" && isOpen) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End" && isOpen) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) selectOption(option);
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className={[styles.dropdown, className].filter(Boolean).join(" ")} ref={rootRef}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.value}>{selectedOption?.label ?? ""}</span>
        <ChevronDown
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          size={16}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          className={styles.menu}
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          aria-activedescendant={`${listboxId}-option-${activeIndex}`}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              id={`${listboxId}-option-${index}`}
              className={`${styles.option} ${
                index === activeIndex ? styles.activeOption : ""
              }`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectOption(option)}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check size={15} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
