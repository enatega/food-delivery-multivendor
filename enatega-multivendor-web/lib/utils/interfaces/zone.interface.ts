export interface IMapZone {
  _id: string;
  title: string;
  description: string;
  location: {
    coordinates: number[][][];
  };
  isActive: boolean;
}

interface PolygonLocation {
  coordinates: number[][][]; // An array of rings; each ring is an array of [longitude, latitude]
  __typename: "Polygon";
}

export interface IArea {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  location: PolygonLocation;
}
