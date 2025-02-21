import { TPolygonPoints } from '../types';
import { TSideBarFormPosition } from '../types/sidebar';
import { IGlobalComponentProps, IPolygonLocation } from './global.interface';

export interface IZoneHeaderProps extends IGlobalComponentProps {
  onSetAddFormVisible: () => void;
}
export interface IZoneTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IZoneMainComponentsProps extends IGlobalComponentProps {
  setIsAddZoneVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setZone: React.Dispatch<React.SetStateAction<IZoneResponse | null>>;
}

export interface IZoneAddFormComponentProps extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
  isAddZoneVisible: boolean;
  onHide: () => void;
  zone: IZoneResponse | null;
}

/* Zone Bound COmponent */
export interface IZoneCustomGoogleMapsBoundComponentProps
  extends IGlobalComponentProps {
  _id: string;
  _path: IPolygonLocation | number[][][];
  onSetZoneCoordinates: (path: TPolygonPoints) => void;
}

/* API */
export interface IZoneResponse {
  __typename: string;
  _id: string;
  title: string;
  description: string;
  location: IPolygonLocation | null;
  isActive: boolean;
}

interface IRiderZone extends IZoneResponse {
  location: IPolygonLocation;
}

export interface IZonesResponse {
  zones: IZoneResponse[];
}

export interface IZonesDataReponse {
  data: IZonesResponse;
}

/* Rider Zone */
export interface IRiderZonesResponse {
  zones: IRiderZone[];
}
