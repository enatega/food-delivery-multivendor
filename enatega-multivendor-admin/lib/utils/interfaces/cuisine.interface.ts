import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { IDropdownSelectItem, IEditState } from './global.interface';
import { IFilterType } from './table.interface';

export interface ICuisine {
  _id: string;
  description: string;
  image?: string;
  name: string;
  shopType: string;
  __typename: string;
}

export interface IGetCuisinesData {
  cuisines: ICuisine[];
}

export interface IGetCuisinesVariables {}

export interface IAddCuisineProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
  setIsEditing: Dispatch<
    SetStateAction<{
      bool: boolean;
      data: ICuisine;
    }>
  >;
  isEditing: IEditState<ICuisine>;
  visible: boolean;
}

export interface ICuisineTableProps {
  data: ICuisine[] | undefined | null;
  loading: boolean;
  filters?: IFilterType | undefined;
  setIsEditing: Dispatch<SetStateAction<IEditState<ICuisine>>>;
  setIsDeleting: Dispatch<SetStateAction<IEditState<ICuisine>>>;
  isDeleting: IEditState<ICuisine>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  setCuisines: Dispatch<SetStateAction<ICuisine[]>>;
  globalFilterValue: string;
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  statusOptions: IDropdownSelectItem[];
  setSelectedStatuses: Dispatch<SetStateAction<string[]>>;
  selectedStatuses: string[];
}
export interface ICuisineScreenHeaderProps {
  handleButtonClick: () => void;
}
export interface ICuisineMainProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  isEditing: IEditState<ICuisine>;
  setIsEditing: Dispatch<SetStateAction<IEditState<ICuisine>>>;
}
export interface ICuisineTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedActions: string[];
  setSelectedActions: Dispatch<SetStateAction<string[]>>;
}
