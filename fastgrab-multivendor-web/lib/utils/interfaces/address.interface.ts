import { ILocationPointCoordinates } from "./location.interface";

export interface IAddress {
    location?: ILocationPointCoordinates; // Assuming pointSchema refers to a geo point
    deliveryAddress: string;
    details?: string;
    label: string;
    selected: boolean;
    isActive: boolean;
  }