import { IDateFilter } from '../dashboard.interface';
import { IGlobalComponentProps } from '../global.interface';

export interface IOrderSuperAdminHeaderProps extends IGlobalComponentProps {
  setSelectedActions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedActions: string[];
  onSearch?: (searchTerm: string) => void;
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dateFilter: IDateFilter;
  handleDateFilter: (dateFilter: IDateFilter) => void;
}
