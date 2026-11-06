import { Check, X } from "lucide-react";
import type { FormEvent } from "react";
import { Input } from "@/ui/Input/Input";
import type { CompanyNameFormProps } from "./types";
import styles from "./CompanyNameForm.module.scss";

export function CompanyNameForm({
  name,
  onNameChange,
  onSubmit,
  onCancel,
}: CompanyNameFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) onSubmit(trimmedName);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        aria-label="კომპანიის სახელი"
        name="name"
        value={name}
        placeholder="კომპანიის სახელი"
        required
        autoFocus
        onChange={(event) => onNameChange(event.currentTarget.value)}
      />
      <button
        type="submit"
        className={`${styles.iconButton} ${styles.saveButton}`}
        aria-label="სახელის შენახვა"
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
