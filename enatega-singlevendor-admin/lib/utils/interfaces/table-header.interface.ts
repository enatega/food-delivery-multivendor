import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { IDropdownSelectItem } from './global.interface';
import { IFilterType } from './table.interface';

export interface ITableHeaderProps {
  statusOptions: IDropdownSelectItem[];
  setSelectedStatuses: Dispatch<SetStateAction<string[]>>;
  selectedStatuses: string[];
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  globalFilterValue: string;
  setFilters?: Dispatch<SetStateAction<IFilterType>>;
}
