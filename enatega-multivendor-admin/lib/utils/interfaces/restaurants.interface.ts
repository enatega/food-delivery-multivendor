import { TSideBarFormPosition } from '../types/sidebar';
import {
  IDropdownSelectItem,
  IGlobalComponentProps,
  IStepperFormProps,
} from './global.interface';
import { IProvider } from './layout.interface';

export interface IRestaurantsContextPropData {
  restaurant?: {
    _id: IDropdownSelectItem | null;
    autoCompleteAddress?: string;
  };
  vendor?: {
    _id: IDropdownSelectItem | null;
  };
  isEditing?: boolean;
}

export interface IRestaurantsContextProps {
  isRestaurantsFormVisible: boolean;
  onRestaurantsFormVisible: (status: boolean) => void;
  activeIndex: number;
  onActiveStepChange: (activeStep: number) => void;
  onClearRestaurntsData: () => void;
  restaurantsContextData: IRestaurantsContextPropData | null;
  onSetRestaurantsContextData: (data: IRestaurantsContextPropData) => void;
  currentTab: string;
  onSetCurrentTab: (tab: string) => void;
}

export interface IRestaurantsProvider extends IProvider {}

export interface IRestaurantsAddFormComponentProps
  extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
}
export interface IRestaurantsTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedActions?: string[];
  setSelectedActions?: (actions: string[]) => void;
}

export interface IRestaurantsMainComponentsProps
  extends IGlobalComponentProps {}

// Components
export interface IRestaurantsVendorDetailsComponentProps
  extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
  vendorsDropdown: IDropdownSelectItem[];
}
export interface IRestaurantsAddRestaurantComponentProps
  extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
}
export interface IRestaurantsRestaurantLocationComponentProps
  extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
  height?: string;
  hideControls?: boolean;
}
export interface IRestaurantsRestaurantDeliveryComponentProps
  extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
}

export interface IRestaurantsRestaurantTimingComponentProps
  extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
}

// Duplicate Dialog
export interface IRestaurantDuplicateDialogComponentProps
  extends IGlobalComponentProps {
  restaurantId: string;
  visible: boolean;
  onHide: () => void;
}
