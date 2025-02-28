import React, {
  Dispatch,
  HTMLAttributeAnchorTarget,
  SetStateAction,
} from 'react';

import { IGlobalProps } from './global.interface';
import { ICategory, ISubCategory } from './category.interface';
import { IOptions } from './options.interface';

// Layout
export interface IProvider extends IGlobalProps {}

/* Layoyt */
export type LayoutState = {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
};

export type LayoutConfig = {
  ripple: boolean;
  inputStyle: string;
  menuMode: string;
  colorScheme: string;
  theme: string;
  scale: number;
};

/* Layout Context */
export interface LayoutContextProps {
  // Super Admin
  isSuperAdminSidebarVisible: boolean;
  showSuperAdminSidebar: (isOpen?: boolean) => void;
  // Restaurant
  isRestaurantSidebarVisible: boolean;
  showRestaurantSidebar: (isOpen?: boolean) => void;
  // Vendor
  isVendorSidebarVisible: boolean;
  showVendorSidebar: (isOpen?: boolean) => void;
}

// Restaurant layout
export interface RestaurantLayoutContextProps {
  restaurantLayoutContextData: RestaurantLayoutContextData;
  onSetRestaurantLayoutContextData: (
    data: Partial<RestaurantLayoutContextData>
  ) => void;
  isAddSubCategoriesVisible: { bool: boolean; parentCategoryId: string };
  setIsAddSubCategoriesVisible: Dispatch<
    SetStateAction<{ bool: boolean; parentCategoryId: string }>
  >;
  category: ICategory | null;
  setCategory: Dispatch<SetStateAction<ICategory | null>>;
  subCategories: ISubCategory[];
  setSubCategories: Dispatch<SetStateAction<ISubCategory[]>>;
  isSubCategoryModalOpen: boolean;
  setIsSubCategoryModalOpen: Dispatch<SetStateAction<boolean>>;
  subCategoryParentId: string;
  setSubCategoryParentId: Dispatch<SetStateAction<string>>;
  isAddOptionsVisible: boolean;
  setIsAddOptionsVisible: Dispatch<SetStateAction<boolean>>;
  option: IOptions | null;
  setOption: Dispatch<SetStateAction<IOptions | null>>;
}

export interface RestaurantLayoutContextData {
  restaurantId: string;
}

// Vendor Layout
export interface VendorLayoutContextProps {
  vendorLayoutContextData: VendorLayoutContextData;
  onSetVendorLayoutContextData: (
    data: Partial<VendorLayoutContextData>
  ) => void;
}

export interface VendorLayoutContextData {
  vendorId: string;
}

/* Menu */

export interface MenuContextProps {
  activeMenu: string;
  setActiveMenu: Dispatch<SetStateAction<string>>;
}

/* AppConfig Types */
export interface AppConfigProps {
  simple?: boolean;
}

/* AppTopbar Types */
// export type NodeRef = MutableRefObject<ReactNode>;
export interface AppTopbarRef {
  menubutton?: HTMLButtonElement | null;
  topbarmenu?: HTMLDivElement | null;
  topbarmenubutton?: HTMLButtonElement | null;
}

/* AppMenu Types */
type CommandProps = {
  originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
  //item: MenuModelItem;
  item: string;
};

export interface MenuProps {
  model: MenuModel[];
}

export interface MenuModel {
  label: string;
  icon?: string;
  items?: MenuModel[];
  to?: string;
  url?: string;
  target?: HTMLAttributeAnchorTarget;
  seperator?: boolean;
}

export interface AppMenuItem extends MenuModel {
  items?: AppMenuItem[];
  badge?: 'UPDATED' | 'NEW';
  badgeClass?: string;
  class?: string;
  preventExact?: boolean;
  visible?: boolean;
  disabled?: boolean;
  replaceUrl?: boolean;
  command?: ({ originalEvent, item }: CommandProps) => void;
}

export interface AppMenuItemProps {
  item?: AppMenuItem;
  parentKey?: string;
  index?: number;
  root?: boolean;
  className?: string;
}
