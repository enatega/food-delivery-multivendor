/* eslint-disable @typescript-eslint/no-empty-object-type */
import { IGlobalProps, IGlobalProviderProps } from "./global.interface";

export interface IConfigurationContextProps extends IGlobalProps {}

export interface IConfiguration {
  _id: string;
  restaurantAppSentryUrl: string;
  currency: string;
  currencySymbol: string;
}

export interface IConfigurationProviderProps extends IGlobalProviderProps {}
