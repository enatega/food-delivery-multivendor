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

export interface IAuthContext {
  token: string;
  setTokenAsync: (token: string) => Promise<void>;
  logout: () => void;
}

export interface IAuthProviderProps extends IGlobalProviderProps {
  client: ApolloClient<NormalizedCacheObject>;
}

interface IRiderLoginResponse {
  token: string;
  userId: string;
}

interface IRiderDefaultCredsResponse {
  riderUsername: string;
  riderPassword: string;
}

export interface IRiderLoginCompleteResponse {
  riderLogin: IRiderLoginResponse;
  lastOrderCreds: IRiderDefaultCredsResponse;
}
