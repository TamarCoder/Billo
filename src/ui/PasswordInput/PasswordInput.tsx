import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input, type InputProps } from "@/ui/Input/Input";
import styles from "./PasswordInput.module.scss";

export function PasswordInput({ className, ...props }: Omit<InputProps, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={[styles.input, className].filter(Boolean).join(" ")}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
