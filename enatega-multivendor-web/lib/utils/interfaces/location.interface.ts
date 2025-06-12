export interface ILocationPointCoordinates {
    coordinates: number[];
}
import { IGlobalComponentProps } from "./global.interface";
import { ILocation } from "./google.map.interface";
import { IArea } from "./zone.interface";

export interface ILocationProvider extends IGlobalComponentProps {}

export interface ILocationContext {
  location: ILocation | null;
  setLocation: React.Dispatch<React.SetStateAction<ILocation | null>>;
  cities: IArea[] | [];
}
