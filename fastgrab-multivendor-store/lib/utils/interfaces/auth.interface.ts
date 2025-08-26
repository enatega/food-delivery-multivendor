/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { IGlobalProviderProps } from "./global.interface";

export interface ILoginInitialValues {
  username: string;
  password: string;
}

export interface IAuthContext {
  token: string;
  setTokenAsync: (token: string) => Promise<void>;
  logout: () => void;
  isSelected: string;
  setIsSelected: Dispatch<SetStateAction<string>>;
}

export interface IAuthProviderProps extends IGlobalProviderProps {
  client: ApolloClient<NormalizedCacheObject>;
}

interface IStoreLoginResponse {
  token: string;
  restaurantId: string;
}

interface IStoreDefaultCredsResponse {
  restaurantUsername: string;
  restaurantPassword: string;
}

export interface IStoreLoginCompleteResponse {
  restaurantLogin: IStoreLoginResponse;
  lastOrderCreds: IStoreDefaultCredsResponse;
}
