import { Check, X } from "lucide-react";
import type { FormEvent } from "react";
import { Input } from "@/ui/Input/Input";
import type { CompanyNameFormProps } from "./types";
import styles from "./CompanyNameForm.module.scss";

export function CompanyNameForm({
  number,
  name,
  onNumberChange,
  onNameChange,
  onSubmit,
  onCancel,
}: CompanyNameFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedNumber = number.trim();
    const trimmedName = name.trim();
    if (trimmedNumber && trimmedName) onSubmit(trimmedNumber, trimmedName);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        className={styles.numberInput}
        aria-label="კომპანიის ნომერი"
        name="number"
        value={number}
        placeholder="ნომერი"
        required
        autoFocus
        onChange={(event) => onNumberChange(event.currentTarget.value)}
      />
      <Input
        aria-label="კომპანიის სახელი"
        name="name"
        value={name}
        placeholder="კომპანიის სახელი"
        required
        onChange={(event) => onNameChange(event.currentTarget.value)}
      />
      <button
        type="submit"
        className={`${styles.iconButton} ${styles.saveButton}`}
        aria-label="კომპანიის შენახვა"
      >
        <Check size={17} />
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="რედაქტირების გაუქმება"
        onClick={onCancel}
      >
        <X size={17} />
      </button>
    </form>
  );
}