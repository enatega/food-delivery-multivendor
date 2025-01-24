'use client';

// Core
import { createContext, useState } from 'react';

// Interface
import {
  ICategory,
  IProvider,
  ISubCategory,
  RestaurantLayoutContextData,
  RestaurantLayoutContextProps,
} from '@/lib/utils/interfaces';
import { SELECTED_RESTAURANT } from '../../utils/constants';
import { onUseLocalStorage } from '../../utils/methods';

// Types
export const RestaurantLayoutContext =
  createContext<RestaurantLayoutContextProps>(
    {} as RestaurantLayoutContextProps
  );

export const RestaurantLayoutProvider = ({ children }: IProvider) => {
  const [restaurantLayoutContextData, setRestaurantLayoutContextData] =
    useState<RestaurantLayoutContextData>({
      restaurantId: onUseLocalStorage('get', SELECTED_RESTAURANT),
    } as RestaurantLayoutContextData);

  // Handlers
  const onSetRestaurantLayoutContextData = (
    data: Partial<RestaurantLayoutContextData>
  ) => {
    setRestaurantLayoutContextData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };
  const [isAddSubCategoriesVisible, setIsAddSubCategoriesVisible] = useState({
    bool: false,
    parentCategoryId: '',
  });
  const [category, setCategory] = useState<ICategory | null>(null);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] =
    useState<boolean>(false);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [subCategoryParentId, setSubCategoryParentId] = useState<string>('');
  const value: RestaurantLayoutContextProps = {
    restaurantLayoutContextData,
    onSetRestaurantLayoutContextData,
    isAddSubCategoriesVisible,
    setIsAddSubCategoriesVisible,
    category,
    setCategory,
    subCategories,
    setSubCategories,
    isSubCategoryModalOpen,
    setIsSubCategoryModalOpen,
    subCategoryParentId,
    setSubCategoryParentId,
  };

  return (
    <RestaurantLayoutContext.Provider value={value}>
      {children}
    </RestaurantLayoutContext.Provider>
  );
};
