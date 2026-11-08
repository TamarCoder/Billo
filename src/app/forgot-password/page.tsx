import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm/ForgotPasswordForm";
import { Modal } from "@/ui/Modal/Modal";

// TODO(auth): connect to the backend password-reset endpoint once it exists.
export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <Modal
      icon={<KeyRound size={22} />}
      title="პაროლის აღდგენა"
      description={
        sent
          ? "თუ მონაცემები სწორია, აღდგენის ბმული ორგანიზაციის მეილზე გაიგზავნება."
          : "შეიყვანე ორგანიზაციის მეილი და საიდენტიფიკაციო კოდი."
      }
      footer={<Link to="/login">შესვლაზე დაბრუნება</Link>}
    >
      {!sent && <ForgotPasswordForm onSubmit={() => setSent(true)} />}
    </Modal>
  );
}
