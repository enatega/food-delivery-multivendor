import { Libraries } from "@react-google-maps/api";
import { ReactNode } from "react";
import { IGlobalComponentProps } from "./global.interface";

export interface IGoogleMapsLoaderComponentProps
  extends IGlobalComponentProps {}

export interface IAutoCompleteItem {
  code: string;
  name: string;
}
export interface ICustomGoogleMapsLocationBoundsComponentProps {
  onStepChange?: (step: number) => void;
  height?: string;
  hideControls?: boolean;
}

export interface IGoogleMapsContext {
  isLoaded: boolean;
}

export interface IGoogleMapsProviderProps {
  apiKey: string;
  libraries: Libraries;
  children: ReactNode;
}

/* Shape */
export interface ICustomShapeComponentProps extends IGlobalComponentProps {
  selected: string;
  onClick: (value: string) => void;
  hidenNames?: string[] | [];
}

export interface ILocationPoint {
  lat: number;
  lng: number;
}

export interface ILocation {
  details?: string;
  label: string;
  latitude: number;
  longitude: number;
  deliveryAddress: string;
}

export interface IPlaceSelectedOption {
  place_id: string;
  description: string;
  matched_substrings: {
    length: number;
    offset: number;
  }[];
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: {
      length: number;
      offset: number;
    }[];
    secondary_text: string;
  };
  terms: {
    offset: number;
    value: string;
  }[];
  types: string[];
  reference: string;
}

export interface IUpdateRestaurantDeliveryZoneVariables {
  id: string;
  boundType: string;
  bounds: number[][][];
  circleBounds?: {
    radius: number;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  postCode?: string;
  city?: string;
}

// Interface for Google Map component props
export interface IGoogleMapComponentProps {
  center: { lat: number; lng: number }; // Center coordinates for the map
  circleRadius?: number; // Optional prop for circle radius in meters
  visible: boolean; // Controls visibility of the map
}
