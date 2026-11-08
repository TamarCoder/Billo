import type { OrganizationSettings } from "@/types/invoice";

export interface OrganizationSettingsFormProps {
  values: OrganizationSettings;
  error: string;
  isSaved: boolean;
  onEdit: () => void;
  onSubmit: (values: OrganizationSettings) => void;
  onCancel: () => void;
  // "plain": no card frame or headings, for use inside a modal that already has them.
  variant?: "card" | "plain";
}
