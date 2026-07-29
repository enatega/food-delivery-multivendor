import { IDateFilter } from '../dashboard.interface';
import { IGlobalComponentProps } from '../global.interface';

export interface IOrderFilterOption {
  _id: string;
  name: string;
  username?: string;
  phone?: string;
}

export interface IOrderSuperAdminHeaderProps extends IGlobalComponentProps {
  setSelectedActions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedActions: string[];
  onSearch?: (searchTerm: string) => void;
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dateFilter: IDateFilter;
  handleDateFilter: (dateFilter: IDateFilter) => void;
  restaurants: IOrderFilterOption[];
  riders: IOrderFilterOption[];
  filtersLoading: boolean;
  selectedRestaurantId: string | null;
  selectedRiderId: string | null;
  setSelectedRestaurantId: (value: string | null) => void;
  setSelectedRiderId: (value: string | null) => void;
}
