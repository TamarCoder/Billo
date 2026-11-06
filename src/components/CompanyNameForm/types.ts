export interface CompanyNameFormProps {
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}
