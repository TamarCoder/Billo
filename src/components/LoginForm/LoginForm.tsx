import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/ui/Button/Button";
import { Checkbox } from "@/ui/Checkbox/Checkbox";
import { FormField } from "@/ui/FormField/FormField";
import { Input } from "@/ui/Input/Input";
import { identificationCodeRules, passwordRules } from "@/lib/authRules";
import styles from "@/components/AuthForm/AuthForm.module.scss";

export interface LoginValues {
  identificationCode: string;
  password: string;
  remember: boolean;
}

export interface LoginFormProps {
  onSubmit: (values: LoginValues) => Promise<void> | void;
  error?: string | null;
  defaultValues?: Partial<LoginValues>;
}

export function LoginForm({ onSubmit, error, defaultValues }: LoginFormProps) {
  const { register, handleSubmit, formState } = useForm<LoginValues>({
    defaultValues: { identificationCode: "", password: "", remember: false, ...defaultValues },
  });
  const { errors, isSubmitting } = formState;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="საიდენტიფიკაციო კოდი" htmlFor="login-code" error={errors.identificationCode?.message}>
        <Input
          id="login-code"
          inputMode="numeric"
          autoComplete="username"
          autoFocus
          status={errors.identificationCode ? "error" : "default"}
          {...register("identificationCode", identificationCodeRules)}
        />
      </FormField>
      <FormField label="პაროლი" htmlFor="login-password" error={errors.password?.message}>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          status={errors.password ? "error" : "default"}
          {...register("password", { required: passwordRules.required })}
        />
      </FormField>
      <div className={styles.row}>
        <Checkbox label="დამახსოვრება" {...register("remember")} />
        <Link className={styles.link} to="/forgot-password">
          დაგავიწყდა პაროლი?
        </Link>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <Button type="submit" variant="success" fullWidth loading={isSubmitting}>
        შესვლა
      </Button>
    </form>
  );
}
