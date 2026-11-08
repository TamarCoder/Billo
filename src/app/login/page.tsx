import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { LoginForm, type LoginValues } from "@/components/LoginForm/LoginForm";
import { ApiError } from "@/lib/fetcher";
import { forgetLogin, loadRememberedLogin, rememberLogin } from "@/lib/rememberedLogin";
import { saveSession } from "@/lib/session";
import { Modal } from "@/ui/Modal/Modal";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Partial<LoginValues> | null>(null);

  useEffect(() => {
    let active = true;
    void loadRememberedLogin().then((login) => {
      if (active) setSaved(login ? { ...login, remember: true } : {});
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(values: LoginValues) {
    setError(null);
    try {
      const { token, expiresAt } = await authApi.login({
        identificationCode: values.identificationCode,
        password: values.password,
      });
      saveSession({ token, expiresAt });
      const { identificationCode, password } = values;
      await (values.remember
        ? rememberLogin({ identificationCode, password })
        : forgetLogin());
      navigate("/home", { replace: true });
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      setError(
        status === 401
          ? "საიდენტიფიკაციო კოდი ან პაროლი არასწორია."
          : status === 429
            ? "ძალიან ბევრი მცდელობა. სცადე 15 წუთში."
            : "სერვერთან კავშირი ვერ დამყარდა. სცადე ცოტა ხანში.",
      );
    }
  }

  return (
    <Modal
      icon={<LogIn size={22} />}
      title="შესვლა"
      description="შედი ორგანიზაციის საიდენტიფიკაციო კოდით და პაროლით."
      footer={
        <>
          ანგარიში არ გაქვს? <Link to="/register">რეგისტრაცია</Link>
        </>
      }
    >
      {saved && <LoginForm onSubmit={handleLogin} error={error} defaultValues={saved} />}
    </Modal>
  );
}
