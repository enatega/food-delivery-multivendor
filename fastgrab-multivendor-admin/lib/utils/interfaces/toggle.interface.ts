export interface IToggleComponentProps {
  checked: boolean;
  loading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showLabel?: boolean;
  placeholder?: string;
}
