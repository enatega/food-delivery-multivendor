import { ChangeEvent, Dispatch, SetStateAction } from 'react';

export interface IActiveOrders {
  _id: string;
  zone: {
    _id: string;
  };
  orderId: string;
  deliveryAddress: {
    location: {
      coordinates: GeolocationCoordinates;
    };
    deliveryAddress: string;
    details: string;
    label: string;
  };
  paymentMethod: string;
  orderStatus: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  rider?: {
    _id: string;
    name: string;
    username: string;
    available: boolean;
  };
}

export interface GeolocationCoordinates {
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  latitude: number;
  longitude: number;
  speed?: number;
}

export interface IGetActiveOrders {
  getActiveOrders: IActiveOrders[];
}

export interface IRidersByZone {
  _id: string;
  name: string;
  username: string;
  phone: string;
  available: boolean;
  zone: {
    _id: string;
    title: string;
  };
}

export interface IGetRidersByZone {
  ridersByZone: IRidersByZone[];
}
export interface IGetRidersByZoneVariables {}
export interface IAssignRider {
  _id: string;
  orderStatus: string;
  rider: {
    _id: string;
    name: string;
  };
}

export interface IUpdateOrderStatus {
  _id: string;
  orderStatus: string;
}
export interface IDispatchTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedActions: string[];
  setSelectedActions: Dispatch<SetStateAction<string[]>>;
}


