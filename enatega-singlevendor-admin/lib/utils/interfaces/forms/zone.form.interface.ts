import { TPolygonPoints } from '../../types';

export interface IZoneForm {
  _id?: string;
  title: string;
  description: string;
  coordinates: TPolygonPoints;
}

export interface IZoneErrors {
  title: string[];
  description: string[];
}
