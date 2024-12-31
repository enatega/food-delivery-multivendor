import { TVendorFormPosition, TVendorMobileTabs } from '@/lib/utils/types';
import { IGlobalComponentProps, IQueryResult } from './global.interface';

export interface IVendorCardProps extends IGlobalComponentProps {
  _id: string;
  userType: string;
  email: string;
  totalRestaurants: number;
  name?: string;
  image?: string;
  uniqueId?: string;
}

export interface IVendorAddFormComponentProps extends IGlobalComponentProps {
  position?: TVendorFormPosition;
}

export interface IVendorContextProps {
  vendorFormVisible: boolean;
  onSetVendorFormVisible: (status: boolean, isEdit?: boolean) => void;
  vendorId: string | null;
  onSetVendorId: (val: string) => void;
  vendorResponse: IQueryResult<IVendorResponseGraphQL | undefined, undefined>;
  globalFilter: string;
  onSetGlobalFilter: (filter: string) => void;
  filtered?: IVendorReponse[];
  isEditingVendor: boolean;
  onSetEditingVendor: (status: boolean) => void;
  onResetVendor: (state: boolean) => void;
}

export interface IVendorHeaderComponentsProps extends IGlobalComponentProps {
  selectedVendorFilter?: string;
  setSelectedVendorFilter?: (val: string) => void;
}

export interface IVendorMobileTabsComponentProps extends IGlobalComponentProps {
  activeTab: TVendorMobileTabs;
  setActiveTab: (val: TVendorMobileTabs) => void;
}

export interface IVendorMainComponentProps
  extends IVendorHeaderComponentsProps,
    IVendorMobileTabsComponentProps {
  selectedRestaurantFilter?: string;
  setSelectedResturantFilter?: (val: string) => void;
}

// Vendors Respect

export interface IVendorReponse {
  unique_id: string;
  _id: string;
  email: string;
  userType: string;
  isActive: boolean;
  name?: string;
  plainPassword?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  restaurants: {
    _id: string;
  }[];
}

export interface IVendorResponseGraphQL {
  vendors: IVendorReponse[];
}

export interface ISingleVendorResponseGraphQL {
  getVendor: IVendorReponse;
}

export interface IGetVendorReponse
  extends Omit<IVendorReponse, 'restaurants' | 'userType'> {
  _id: string;
  email: string;
}

export interface IGetVendorResponseGraphQL {
  getVendor: IVendorReponse;
}

export interface ICreateVendorResponse
  extends Omit<IVendorReponse, 'restaurants'> {}

export interface ICreateVendorResponseGraphQL {
  createVendor: ICreateVendorResponse;
}

/* Vendor User */
// 1. Restaurants
export interface IVendorRestaurantsMainComponentProps {}

// Vendor Profile
export interface IVendorUpdateFormComponentProps extends IGlobalComponentProps {
  position?: TVendorFormPosition;
  vendorFormVisible?: boolean;
  setIsUpdateProfileVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
