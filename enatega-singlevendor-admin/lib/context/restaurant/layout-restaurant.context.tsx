'use client';

// Core
import { createContext, useState } from 'react';

// Interface
import {
  ICategory,
  IOptions,
  IProvider,
  ISubCategory,
  RestaurantLayoutContextData,
  RestaurantLayoutContextProps,
} from '@/lib/utils/interfaces';

// Utils
import { SELECTED_RESTAURANT, SELECTED_SHOPTYPE } from '../../utils/constants';
import { onUseLocalStorage } from '../../utils/methods';

// Types
export const RestaurantLayoutContext =
  createContext<RestaurantLayoutContextProps>(
    {} as RestaurantLayoutContextProps
  );

export const RestaurantLayoutProvider = ({ children }: IProvider) => {
  // States
  const [isAddOptionsVisible, setIsAddOptionsVisible] = useState(false);
  const [option, setOption] = useState<IOptions | null>(null);
  const [restaurantLayoutContextData, setRestaurantLayoutContextData] =
    useState<RestaurantLayoutContextData>({
      restaurantId: onUseLocalStorage('get', SELECTED_RESTAURANT),
      shopType: onUseLocalStorage('get', SELECTED_SHOPTYPE ),
    } as RestaurantLayoutContextData);
  const [isAddSubCategoriesVisible, setIsAddSubCategoriesVisible] = useState({
    bool: false,
    parentCategoryId: '',
  });
  const [category, setCategory] = useState<ICategory | null>(null);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] =
    useState<boolean>(false);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [subCategoryParentId, setSubCategoryParentId] = useState<string>('');

  // Handlers
  const onSetRestaurantLayoutContextData = (
    data: Partial<RestaurantLayoutContextData>
  ) => {
    setRestaurantLayoutContextData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };
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
    isAddOptionsVisible,
    setIsAddOptionsVisible,
    option,
    setOption
  };

  return (
    <RestaurantLayoutContext.Provider value={value}>
      {children}
    </RestaurantLayoutContext.Provider>
  );
};
