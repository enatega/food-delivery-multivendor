import { IGlobalComponentProps } from './global.interface';

export interface ICommissionRateHeaderProps extends IGlobalComponentProps {
  setSelectedActions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedActions: string[];
  onSearch: (searchTerm: string) => void;
}

export interface ICommissionRateScreenHeaderProps
  extends IGlobalComponentProps {
  setIsAddCommissionRateVisible: (visible: boolean) => void;
}
