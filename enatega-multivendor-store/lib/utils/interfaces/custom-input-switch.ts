export interface CustomSwitchProps {
  value: boolean;
  onToggle: (val: boolean) => void;
  isDisabled?: boolean;
}
