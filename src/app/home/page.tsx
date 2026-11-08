import { useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { issuersApi } from "@/api/issuers";
import { ConfirmDelete } from "@/components/ConfirmDelete/ConfirmDelete";
import { Card } from "@/components/Card/Card";
import { OrganizationSettingsForm } from "@/components/OrganizationSettingsForm/OrganizationSettingsForm";
import { useIssuers } from "@/hooks/api/useIssuers";
import { EMPTY_ORGANIZATION_SETTINGS } from "@/lib/invoiceStorage";
import type { Issuer } from "@/types/api";
import type { OrganizationSettings } from "@/types/invoice";
import { Modal } from "@/ui/Modal/Modal";
import styles from "./page.module.scss";

type Dialog =
  | { kind: "add" }
  | { kind: "edit"; issuer: Issuer }
  | { kind: "delete"; issuer: Issuer }
  | null;

function toSettings(issuer: Issuer): OrganizationSettings {
  return {
    title: issuer.title,
    issuerAddress: issuer.issuerAddress,
    issuerIdentificationNumber: issuer.issuerIdentificationNumber,
    bankName: issuer.bankName,
    bankCode: issuer.bankCode,
    bankAccount: issuer.bankAccount,
  };
}

const errorText = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function HomePage() {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();
  const { data: issuers, error: loadError, isLoading } = useIssuers();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [saveError, setSaveError] = useState("");
  const addFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dialog?.kind === "add") {
      addFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [dialog]);

  const formValues = useMemo(
    () => (dialog?.kind === "edit" ? toSettings(dialog.issuer) : EMPTY_ORGANIZATION_SETTINGS),
    [dialog],
  );

  const closeDialog = () => {
    setDialog(null);
    setSaveError("");
  };

  const refresh = () =>
    Promise.all([mutate(API_ENDPOINTS.issuers), mutate(API_ENDPOINTS.settings)]);

  const saveIssuer = async (values: OrganizationSettings) => {
    setSaveError("");
    try {
      if (dialog?.kind === "edit") {
        await issuersApi.update(dialog.issuer.id, values);
        await refresh();
        closeDialog();
        return;
      }
      const created = await issuersApi.create(values);
      await refresh();
      closeDialog();
      navigate(`/invoice/${created.id}`);
    } catch (error) {
      setSaveError(errorText(error, "ორგანიზაციის შენახვა ვერ მოხერხდა."));
    }
  };

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="მდებარეობა">
        <span>მთავარი</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">ორგანიზაციები</span>
      </nav>

      {isLoading && <p className={styles.status} role="status">იტვირთება…</p>}
      {loadError && (
        <p className={styles.error} role="alert">
          ორგანიზაციების ჩატვირთვა ვერ მოხერხდა.
        </p>
      )}

      <section className={styles.grid} aria-label="ორგანიზაციების სია">
        {issuers?.map((issuer) => (
          <article key={issuer.id} className={styles.card}>
            <button
              type="button"
              className={styles.cardOpen}
              onClick={() => navigate(`/invoice/${issuer.id}`)}
            >
              <span className={styles.cardTitle}>{issuer.title || "უსახელო ორგანიზაცია"}</span>
              <span className={styles.cardCode}>{issuer.issuerIdentificationNumber}</span>
            </button>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`${issuer.title} — რედაქტირება`}
                title="რედაქტირება"
                onClick={() => setDialog({ kind: "edit", issuer })}
              >
                <Pencil size={16} />
              </button>
              {!issuer.isPrimary && (
                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.danger}`}
                  aria-label={`${issuer.title} — წაშლა`}
                  title="წაშლა"
                  onClick={() => setDialog({ kind: "delete", issuer })}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </article>
        ))}

        <button type="button" className={styles.addCard} onClick={() => setDialog({ kind: "add" })}>
          <span className={styles.addIcon} aria-hidden="true">
            <Plus size={18} />
          </span>
          <span>ახალი ორგანიზაციის დამატება</span>
        </button>
      </section>

      {dialog?.kind === "add" && (
        <div ref={addFormRef}>
          <Card
            padding="lg"
            heading="ახალი ორგანიზაცია"
          >
            <OrganizationSettingsForm
              values={EMPTY_ORGANIZATION_SETTINGS}
              error={saveError}
              isSaved={false}
              onEdit={() => setSaveError("")}
              onSubmit={saveIssuer}
              onCancel={closeDialog}
              variant="plain"
            />
          </Card>
        </div>
      )}

      {dialog?.kind === "edit" && (
        <Modal
          backdrop="dim"
          size="lg"
          title="ორგანიზაციის რედაქტირება"
          description="შეავსე ორგანიზაციის მონაცემები. ისინი ინვოისზე გამომწერად ჩაიწერება."
          onClose={closeDialog}
        >
          <OrganizationSettingsForm
            values={formValues}
            error={saveError}
            isSaved={false}
            onEdit={() => setSaveError("")}
            onSubmit={saveIssuer}
            onCancel={closeDialog}
            variant="plain"
          />
        </Modal>
      )}

      {dialog?.kind === "delete" && (
        <ConfirmDelete
          itemName={dialog.issuer.title || "უსახელო ორგანიზაცია"}
          onConfirm={async () => {
            await issuersApi.remove(dialog.issuer.id);
            await refresh();
          }}
          onClose={closeDialog}
        />
      )}
    </main>
  );
}
