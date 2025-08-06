import { OverridableTokenClientConfig } from "@react-oauth/google";
import { Dispatch, SetStateAction } from "react";
import { IUser } from "./orders.interface";

export interface IAppBarProps {
  handleModalToggle: () => void;
}
export interface IAuthModalProps {
  isAuthModalVisible: boolean;
  handleModalToggle: () => void;
}

export interface IAuthFormData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  type?: "default" | "google";
}
export interface ILoginWithGoogleProps {
  googleLogin: (overrideConfig?: OverridableTokenClientConfig) => void;
  handleChangePanel: (index: number) => void;
  handleFormChange: (name: string, value: string) => void;
  formData: IAuthFormData;
  
}

export interface ILoginWithEmailProps {
  handleChangePanel: (index: number) => void;
  handleFormChange: (name: string, value: string) => void;
  formData: IAuthFormData;
}

export interface ISaveEmailAddressProps {
  handleChangePanel: (index: number) => void;
}

export interface IEmailVerificationProps {
  emailOtp: string;
  setEmailOtp: Dispatch<SetStateAction<string>>;
  handleChangePanel: (index: number) => void;
}
export interface IPhoneVerificationProps {
  phoneOtp: string;
  setPhoneOtp: Dispatch<SetStateAction<string>>;
  handleChangePanel: (index: number) => void;
}

export interface IUserLoginArguments {
  appleId?: string;
  email?: string;
  password?: string;
  phone?: string;
  type?: string;
  name?: string;
  notificationToken?: string;
  isActive?: boolean;
}

export interface IAuthContextProps {
  authToken: string;
  setAuthToken: Dispatch<SetStateAction<string>>;
  user: IUser | null;
  setUser: Dispatch<SetStateAction<ILoginProfile | null>>;
  checkEmailExists: (email: string) => Promise<IEmailExists>;
  checkPhoneExists: (phone: string) => Promise<boolean | void>;
  handleUserLogin: (
    user: IUserLoginArguments & {
      phone?: string;
    },
  ) => Promise<ILoginProfileResponse | null | undefined>;
  activePanel: number;
  setActivePanel: Dispatch<SetStateAction<number>>;
  isAuthModalVisible: boolean;
  setIsAuthModalVisible: Dispatch<SetStateAction<boolean>>;
  otp: string | null;
  setOtp: Dispatch<SetStateAction<string | null>>;
  sendOtpToEmailAddress: { (email: string, type?: string): Promise<void> };
  sendOtpToPhoneNumber: { (phone: string): Promise<void> };
  handleCreateUser: (user: ICreateUserArguments) => Promise<ICreateUserData>;
  isRegistering: boolean;
  setIsRegistering: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  refetchProfileData: boolean;
  setRefetchProfileData: Dispatch<SetStateAction<boolean>>;
  handlePasswordReset: (password: string, email: string, setFormData: Dispatch<SetStateAction<IAuthFormData>>) => Promise<void>;
}
export interface ILoginProfile {
  userId?: string;
  token?: string;
  tokenExpiration?: string;
  name?: string;
  phone?: string;
  phoneIsVerified?: boolean;
  email?: string;
  emailIsVerified?: boolean;
  picture?: string;
  addresses?: {
    location?: {
      coordinates?: string[];
    };
    deliveryAddress?: string;
  };
  isNewUser?: boolean;
  userTypeId?: string;
  isActive?: boolean;
}
export interface ILoginProfileResponse {
  login: ILoginProfile;
}

export interface IPhoneExistsResponse {
  phoneExist: { _id: string };
}

export interface IEmailExists {
  _id: string;
  userType: string;
}
export interface IEmailExistsResponse {
  emailExist: IEmailExists;
}

export interface ISendOtpToPhoneResponse {
  sendOtpToPhoneNumber: { result: boolean };
}

export interface ISendOtpToEmailResponse {
  sendOtpToEmail: { result: boolean };
}

export interface IUpdateUserResponse {
  updateUser: {
    name: string;
    phone?: string;
    phoneIsVerified: boolean;
    emailIsVerified: boolean;
  };
}
export interface Point {
  coordinates: [number, number];
}

export interface IUserAddress {
  _id: string;
  location?: Point; // optional if it can be null
  deliveryAddress: string;
  details?: string;
  label: string;
  selected?: boolean;
}
export interface IUserAddressProps {
  userAddress: IUserAddress | null;
  setUserAddress: (address: IUserAddress | null) => void;
}

export interface IEnterPasswordProps {
  handleChangePanel: (index: number) => void;
  handleFormChange: (name: string, value: string) => void;
  setFormData: Dispatch<SetStateAction<IAuthFormData>>;
  formData: IAuthFormData;
}

export interface IUserAddressComponentProps {
  editAddress?: IUserAddress | null;
  visible: boolean;
  onHide: () => void;
}

export interface ICreateUserData {
  userId: string;
  token: string;
  tokenExpiration: number;
  name: string;
  phone: string;
  phoneIsVerified: boolean;
  email: string;
  emailIsVerified: boolean;
  picture: string;
  isNewUser: boolean;
  userTypeId: string;
}
export interface ICreateUserResponse {
  createUser: ICreateUserData;
}

export interface ICreateUserArguments {
  phone?: string;
  email?: string;
  password?: string;
  name?: string;
  notificationToken?: string;
  appleId?: string;
}
export interface IVerificationEmailForChangePasswordProps {
  handleSubmitAfterVerification: () => void;
  handleResendEmailOtp: () => void;
  emailOtp: string;
  setEmailOtp: (otp: string) => void;
  formData: { email?: string, password?: string, name?: string, phone?: string };
}