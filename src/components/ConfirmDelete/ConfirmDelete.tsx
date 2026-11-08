import { useState } from "react";
import { Button } from "@/ui/Button/Button";
import { Modal } from "@/ui/Modal/Modal";
import styles from "./ConfirmDelete.module.scss";

interface ConfirmDeleteProps {
  itemName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function ConfirmDelete({ itemName, onConfirm, onClose }: ConfirmDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setIsDeleting(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "წაშლა ვერ მოხერხდა.");
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      backdrop="dim"
      title="ნამდვილად გსურთ წაშლა?"
      description={`„${itemName}“ წაიშლება. ამის დაბრუნება შეუძლებელია.`}
      onClose={onClose}
    >
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <Button variant="outline" size="sm" onClick={onClose} disabled={isDeleting}>
          გაუქმება
        </Button>
        <Button variant="danger" size="sm" loading={isDeleting} onClick={() => void confirm()}>
          წაშლა
        </Button>
      </div>
    </Modal>
  );
}
