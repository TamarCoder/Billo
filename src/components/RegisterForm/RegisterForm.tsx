import { useForm } from "react-hook-form";
import { Button } from "@/ui/Button/Button";
import { FormField } from "@/ui/FormField/FormField";
import { Input } from "@/ui/Input/Input";
import { PasswordInput } from "@/ui/PasswordInput/PasswordInput";
import { emailRules, identificationCodeRules, passwordRules } from "@/lib/authRules";
import styles from "@/components/AuthForm/AuthForm.module.scss";

export interface RegisterValues {
  identificationCode: string;
  email: string;
  password: string;
}

export interface RegisterFormProps {
  onSubmit: (values: RegisterValues) => Promise<void> | void;
  error?: string | null;
}

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const { register, handleSubmit, formState } = useForm<RegisterValues>();
  const { errors, isSubmitting } = formState;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="საიდენტიფიკაციო კოდი" htmlFor="register-code" error={errors.identificationCode?.message}>
        <Input
          id="register-code"
          inputMode="numeric"
          autoComplete="username"
          autoFocus
          status={errors.identificationCode ? "error" : "default"}
          {...register("identificationCode", identificationCodeRules)}
        />
      </FormField>
      <FormField label="ორგანიზაციის მეილი" htmlFor="register-email" error={errors.email?.message}>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          status={errors.email ? "error" : "default"}
          {...register("email", emailRules)}
        />
      </FormField>
      <FormField label="პაროლი" htmlFor="register-password" error={errors.password?.message}>
        <PasswordInput
          id="register-password"
          autoComplete="new-password"
          status={errors.password ? "error" : "default"}
          {...register("password", passwordRules)}
        />
      </FormField>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth loading={isSubmitting}>
        რეგისტრაცია
      </Button>
    </form>
  );
}
