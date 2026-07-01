export interface ISignInForm {
  email: string;
  password: string;
}

export interface ISignInFormErrors {
  email: string[];
  password: string[];
}

export interface ISignInOwnerRestaurants {
  _id: string;
  orderId?: string;
  name: string;
  image?: string;
  address?: string;
}

export interface ILoginResponse {
  shopType?: string;
  userId: string;
  token: string;
  tokenExpiration?: string;
  refreshToken?: string;
  refreshTokenExpiration?: string;
  email: string;
  name?: string;
  image?: string;
  userType: 'ADMIN' | 'STAFF' | 'VENDOR' | 'RESTAURANT';
  userTypeId?: string;
  restaurants: ISignInOwnerRestaurants[];
  permissions?: string[];
  isActive?: boolean;
  __typename?: string;
}

export interface IOwnerLoginDataResponse {
  ownerLogin: ILoginResponse;
}

export interface IOwnerSessionDataResponse {
  ownerSession: ILoginResponse;
}
