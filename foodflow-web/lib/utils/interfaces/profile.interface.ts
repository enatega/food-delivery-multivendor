import { IUserAddress } from "./auth.interface";

export interface ISingleAddress {
  _id: string;
  label: string;
  deliveryAddress: string;
  details: string;
  location: {
    coordinates: [string, string];
  };
  selected: boolean;
}

export interface IAddresses {
  addresses: ISingleAddress[];
}

export interface IProfileResponse extends IAddresses {
  profile: {
    _id: string;
    name: string;
    phone: string;
    phoneIsVerified: boolean;
    email: string;
    emailIsVerified: boolean;
    notificationToken: string;
    isActive: boolean;
    isOrderNotification: boolean;
    isOfferNotification: boolean;
    favourite: string[];
  };
}

export interface IAddressItemProps {
  address: IUserAddress;
  activeDropdown: string | null;
  toggleDropdown: (id: string) => void;
  handleDelete: (id: string) => void;
  setDropdownRef: (id: string) => (el: HTMLDivElement | null) => void;
  onEditAddress?: (address: IUserAddress | null) => void;
}

export interface IDeleteAccountDialogProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  userName?: string;
  deleteReason?: string;
  setDeleteReason?: (reason: string) => void;
  loading?: boolean;
}


export interface IUpdateUserPhoneArguments {
  phone?: string;
  name: string;
  phoneIsVerified: boolean;
}

export interface IUpdateUserEmailArguments {
    email: string;
    name: string;
    emailIsVerified: boolean;
  }

