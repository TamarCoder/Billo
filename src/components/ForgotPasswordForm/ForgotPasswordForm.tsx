import { useForm } from "react-hook-form";
import { Button } from "@/ui/Button/Button";
import { FormField } from "@/ui/FormField/FormField";
import { Input } from "@/ui/Input/Input";
import { emailRules, identificationCodeRules } from "@/lib/authRules";
import styles from "@/components/AuthForm/AuthForm.module.scss";

export interface ForgotPasswordValues {
  identificationCode: string;
  email: string;
}

export function ForgotPasswordForm({
  onSubmit,
}: {
  onSubmit: (values: ForgotPasswordValues) => void;
}) {
  const { register, handleSubmit, formState } = useForm<ForgotPasswordValues>();
  const { errors, isSubmitting } = formState;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="ორგანიზაციის მეილი" htmlFor="forgot-email" error={errors.email?.message}>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          autoFocus
          status={errors.email ? "error" : "default"}
          {...register("email", emailRules)}
        />
      </FormField>
      <FormField label="საიდენტიფიკაციო კოდი" htmlFor="forgot-code" error={errors.identificationCode?.message}>
        <Input
          id="forgot-code"
          inputMode="numeric"
          status={errors.identificationCode ? "error" : "default"}
          {...register("identificationCode", identificationCodeRules)}
        />
      </FormField>
      <Button type="submit" variant="success" fullWidth loading={isSubmitting}>
        აღდგენის ბმულის გაგზავნა
      </Button>
    </form>
  );
}
