export interface ICoordinates {
  coordinates?: [string, string];
  __typename?: string;
}

export interface ITimings {
  startTime: [string, string];
  endTime: [string, string];
  __typename: string;
}

export interface IOpeningTime {
  day: string;
  times: ITimings[];
  __typename: string;
}

export interface IRestaurantInfo {
  _id: string;
  name?: string;
  username?: string;
  phone?: string;
  address?: string;
  location?: ICoordinates;
  isAvailable?: boolean;
  openingTimes: IOpeningTime[];
  description: string;
}

export interface IInfoModalProps {
  visible: boolean;
  onHide: () => void;
  restaurantInfo: IRestaurantInfo;
}
