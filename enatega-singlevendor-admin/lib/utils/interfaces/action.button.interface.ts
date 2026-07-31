import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IDropdownSelectItem } from './global.interface';

export interface IGlobalButtonProps {
  Icon: IconDefinition;
  title: string;
  statusOptions: IDropdownSelectItem[];
  selectedOption: IDropdownSelectItem[] | null;
  handleOptionChange: (key: string, items: IDropdownSelectItem[]) => void;
  name: string;
}
