export interface CompanyNameFormProps {
  number: string;
  name: string;
  onNumberChange: (number: string) => void;
  onNameChange: (name: string) => void;
  onSubmit: (number: string, name: string) => void;
  onCancel: () => void;
  disabled?: boolean;
}