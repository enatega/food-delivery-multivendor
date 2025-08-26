/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Dispatch } from "react";
import { SetStateAction } from "react";
import {
  IGlobalComponentProps,
  IGlobalProviderProps,
} from "./global.interface";

export interface ICoodinates {
  latitude: string;
  longitude: string;
}

export interface ILocationContextProps {
  location: ICoodinates;
  locationPermission: boolean;
  setLocationPermission: Dispatch<SetStateAction<boolean>>;
}

export interface ILocationProviderProps extends IGlobalProviderProps {}

export interface ILocationPermissionComponentProps
  extends IGlobalComponentProps {}
