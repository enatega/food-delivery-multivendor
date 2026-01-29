/* eslint-disable @typescript-eslint/no-empty-object-type */
import { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { IGlobalProviderProps } from "./global.interface";
import { IRiderEarnings } from "./rider-earnings.interface";
import { Dispatch, SetStateAction } from "react";

export interface ILoginInitialValues {
  username: string;
  password: string;
}

export interface ISignUpInitialValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  vehicleType: string;
  zone: string;
  referralCode?: string;
}

export interface IRiderInput {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  available: boolean;
  vehicleType: string;
  zone: string;
  madeBy: "ADMIN" | "RIDER_REQUEST";
  riderRequestStatus: "PENDING" | "ACCEPTED";
  referralCode?: string;
}


export interface IAuthContext {
  token: string;
  setTokenAsync: (token: string) => Promise<void>;
  logout: () => void;
}

export interface IAuthProviderProps extends IGlobalProviderProps {
  client: ApolloClient<NormalizedCacheObject>;
}

export interface IRiderLoginResponse {
  token: string;
  userId: string;
}

export interface IRiderDefaultCredsResponse {
  riderUsername: string;
  riderPassword: string;
}

export interface IRiderLoginCompleteResponse {
  riderLogin: IRiderLoginResponse;
  lastOrderCreds: IRiderDefaultCredsResponse;
}
