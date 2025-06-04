import { ReactNode } from "react";
import { IGlobalProps } from "./global.interface";

export interface IConfigurationContextProps extends IGlobalProps {}

export interface IConfigurationProviderProps {
  children: ReactNode;
}

export interface IFirebaseConfig {
  FIREBASE_AUTH_DOMAIN: string ;
  FIREBASE_KEY: string ;
  FIREBASE_PROJECT_ID: string ;
  FIREBASE_STORAGE_BUCKET: string ;
  FIREBASE_MSG_SENDER_ID: string ;
  FIREBASE_APP_ID: string 
  FIREBASE_MEASUREMENT_ID: string 
}
