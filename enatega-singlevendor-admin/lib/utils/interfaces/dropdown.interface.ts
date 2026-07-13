import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { CSSProperties } from 'react';
import { IDropdownSelectItem, IGlobalComponentProps } from './global.interface';
import { DropdownChangeEvent } from 'primereact/dropdown';

interface ISelectionComponentProps extends IGlobalComponentProps {
  style?: CSSProperties;
  isLoading?: boolean;
}

export interface IDropdownExtraButton {
  onChange: () => void;
  title: string;
}

export interface IMultiSelectComponentProps extends ISelectionComponentProps {
  name: string;
  optionLabel?: string;
  optionValue?: string;
  placeholder: string;
  showLabel?: boolean;
  selectedItems: IDropdownSelectItem[] | null;
  setSelectedItems: (key: string, items: IDropdownSelectItem[]) => void;
  options: IDropdownSelectItem[];
  dropDownIcon?: IconDefinition;
  onChange?: (selected: IDropdownSelectItem[]) => void;
  extraFooterButton?: IDropdownExtraButton;
  className?: string;
  multiSelectClassName?: string;
}

export interface IDropdownComponentProps extends ISelectionComponentProps {
  name: string;
  optionLabel?: string;
  optionValue?: string;
  placeholder: string;
  showLabel?: boolean;
  invalid?: boolean;
  filter?: boolean;
  loading?: boolean;
  selectedItem: IDropdownSelectItem | null;
  setSelectedItem: (key: string, item: IDropdownSelectItem) => void;
  options: IDropdownSelectItem[];
  extraFooterButton?: IDropdownExtraButton;
  onChange?: (e: DropdownChangeEvent) => void;
}
