import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/Card/Card";
import { Button } from "@/ui/Button/Button";
import { Input } from "@/ui/Input/Input";
import type { OrganizationSettingsFormProps } from "./types";
import { organizationSettingsResolver } from "./organizationSettingsResolver";
import styles from "./OrganizationSettingsForm.module.scss";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <span className={styles.fieldError} id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function OrganizationSettingsForm({
  values,
  error,
  isSaved,
  onEdit,
  onSubmit,
  onCancel,
  variant = "card",
}: OrganizationSettingsFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: values,
    resolver: organizationSettingsResolver,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    reset(values);
  }, [reset, values]);

  const form = (
      <form
        className={styles.form}
        onChange={onEdit}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <fieldset
          className={variant === "plain" ? `${styles.formSection} ${styles.plainSection}` : styles.formSection}
        >
          {variant === "card" && <legend>ორგანიზაცია</legend>}
          <Field
            id="organization-title"
            label="ორგანიზაცია"
            error={errors.title?.message}
          >
            <Input
              id="organization-title"
              required
              status={errors.title ? "error" : "default"}
              aria-describedby={errors.title ? "organization-title-error" : undefined}
              {...register("title")}
            />
          </Field>
          <div className={styles.fieldGrid}>
            <Field
              id="organization-address"
              label="მისამართი"
              error={errors.issuerAddress?.message}
            >
              <Input
                id="organization-address"
                required
                status={errors.issuerAddress ? "error" : "default"}
                aria-describedby={
                  errors.issuerAddress ? "organization-address-error" : undefined
                }
                {...register("issuerAddress")}
              />
            </Field>
            <Field
              id="organization-identification-number"
              label="ორგანიზაციის საიდენტიფიკაციო კოდი"
              error={errors.issuerIdentificationNumber?.message}
            >
              <Input
                id="organization-identification-number"
                required
                status={errors.issuerIdentificationNumber ? "error" : "default"}
                aria-describedby={
                  errors.issuerIdentificationNumber
                    ? "organization-identification-number-error"
                    : undefined
                }
                {...register("issuerIdentificationNumber")}
              />
            </Field>
          </div>
          <div className={styles.bankGrid}>
            <Field
              id="organization-bank-name"
              label="ბანკი"
              error={errors.bankName?.message}
            >
              <Input
                id="organization-bank-name"
                required
                status={errors.bankName ? "error" : "default"}
                aria-describedby={
                  errors.bankName ? "organization-bank-name-error" : undefined
                }
                {...register("bankName")}
              />
            </Field>
            <Field
              id="organization-bank-code"
              label="ბანკის კოდი"
              error={errors.bankCode?.message}
            >
              <Input
                id="organization-bank-code"
                required
                status={errors.bankCode ? "error" : "default"}
                aria-describedby={
                  errors.bankCode ? "organization-bank-code-error" : undefined
                }
                {...register("bankCode")}
              />
            </Field>
            <Field
              id="organization-bank-account"
              label="ანგარიშის ნომერი"
              error={errors.bankAccount?.message}
            >
              <Input
                id="organization-bank-account"
                required
                status={errors.bankAccount ? "error" : "default"}
                aria-describedby={
                  errors.bankAccount
                    ? "organization-bank-account-error"
                    : undefined
                }
                {...register("bankAccount")}
              />
            </Field>
          </div>
        </fieldset>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {isSaved && (
          <p className={styles.success} role="status">
            ორგანიზაციის მონაცემები შენახულია და ინვოისებში გამოიყენება.
          </p>
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              reset(values);
              onCancel();
            }}
          >
            გაუქმება
          </Button>
          <Button type="submit" variant="success" size="sm">
            შენახვა
          </Button>
        </div>
      </form>
  );

  if (variant === "plain") return form;

  return (
    <Card
      className={styles.settingsCard}
      padding="md"
      heading="ორგანიზაციის შესახებ ინფორმაცია"
    >
      {form}
    </Card>
  );
}
