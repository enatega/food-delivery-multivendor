import { Dispatch, SetStateAction } from 'react';
import { TSideBarFormPosition } from '../types/sidebar';
import {
  IGlobalComponentProps,
  IGlobalTableHeaderProps,
} from './global.interface';

export interface ICategoryHeaderProps extends IGlobalComponentProps {
  setIsAddCategoryVisible: (visible: boolean) => void;
}

export interface ICategoryTableHeaderProps extends IGlobalTableHeaderProps {}

export interface ICategoryAddFormComponentProps extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
  isAddCategoryVisible: boolean;
  onHide: () => void;
  category: ICategory | null;
  subCategories?: ISubCategory[];
  refetchCategories?: () => void;
}

export interface ICategoryMainComponentsProps extends IGlobalComponentProps {
  setIsAddCategoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCategory: React.Dispatch<React.SetStateAction<ICategory | null>>;
  setSubCategories: Dispatch<SetStateAction<ISubCategory[]>>;
  setIsAddSubCategoriesVisible: Dispatch<
    SetStateAction<{
      bool: boolean;
      parentCategoryId: string;
    }>
  >;
}

export interface ISubCategoriesAddFormProps {
  onHide: () => void;
  isAddSubCategoriesVisible: {
    bool: boolean;
    parentCategoryId: string;
  };
  category: ICategory | null;
}
/* API */
export interface ICategory {
  _id: string;
  title: string;
}

export interface ICategoryByRestaurantResponse {
  restaurant: {
    _id: string;
    categories: ICategory[];
    __typename: string;
  };
}

// Sub-Category
export interface ISubCategory {
  _id?: string;
  title: string;
  parentCategoryId: string;
  __typename?: string;
}

export interface ISubCategoryResponse {
  subCategories: ISubCategory[];
}

export interface ISubCategoryByParentIdResponse {
  subCategoriesByParentId: ISubCategory[];
}

export interface ISubCategorySingleResponse {
  subCategory: ISubCategory;
}

export interface ISubCategoriesPreviewModalProps {
  subCategoryParentId: string;
  isSubCategoryModalOpen: boolean;
  setIsSubCategoryModalOpen: Dispatch<SetStateAction<boolean>>;
}
