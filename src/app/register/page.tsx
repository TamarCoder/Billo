import { useState } from "react";
import { Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { RegisterForm, type RegisterValues } from "@/components/RegisterForm/RegisterForm";
import { ApiError } from "@/lib/fetcher";
import { Modal } from "@/ui/Modal/Modal";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(values: RegisterValues) {
    setError(null);
    try {
      await authApi.register(values);
      navigate("/login", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("ეს ორგანიზაცია ან მეილი უკვე დარეგისტრირებულია.");
      } else if (err instanceof ApiError && err.status === 400) {
        setError("შეამოწმე შეყვანილი მონაცემები.");
      } else {
        setError("სერვერთან კავშირი ვერ დამყარდა. სცადე ცოტა ხანში.");
      }
    }
  }

  return (
    <Modal
      icon={<Building2 size={22} />}
      title="ორგანიზაციის რეგისტრაცია"
      description="მეილი გჭირდება პაროლის აღსადგენად, თუ დაგავიწყდება."
      footer={
        <>
          უკვე გაქვს ანგარიში? <Link to="/login">შესვლა</Link>
        </>
      }
    >
      <RegisterForm onSubmit={handleRegister} error={error} />
    </Modal>
  );
}
