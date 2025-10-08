interface IPoint {
  __typename: 'Point';
  coordinates: [string, string];
}

export interface IAddress {
  __typename?: 'Address';
  _id: string;
  deliveryAddress: string;
  details: string;
  label: string;
  selected: boolean;
  location?: IPoint;
}

export interface IUserResponse {
  __typename?: 'User';
  _id: string;
  name: string;
  email: string;
  emailIsVerified: boolean;
  phone: string;
  phoneIsVerified: boolean;
  isActive: boolean;
  status: string;
  lastLogin: string;
  isOrderNotification: boolean;
  isOfferNotification: boolean;
  createdAt: string;
  updatedAt: string;
  notificationToken: string;
  userType: string;
  favourite: string[];
  addresses: IAddress[];
}

export interface IUsersDataResponse {
  users: IUserResponse[];
}

export interface IUsersTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
