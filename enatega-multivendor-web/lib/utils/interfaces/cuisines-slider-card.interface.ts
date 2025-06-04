import { IGlobalComponentProps } from "./global.interface";

export interface ICuisinesSliderCardComponentProps<T> extends IGlobalComponentProps {
  title: string;
  data: T[];
  last?: boolean;
  showLogo?: boolean;
  cuisines?: boolean;
}

export interface ICuisinesSliderCardItemProps {
  _id: string;
  name: string;
  description?: string;
  image: string;
  shopType: string;
  logo?: string;
  slug?: string
}

export interface ICuisinesCardProps {
  item: ICuisinesSliderCardItemProps;
  cuisines?: boolean
  showLogo?:boolean
}

export type CuisinesSliderCardComponent = <T extends ICuisinesSliderCardItemProps>(
  props: ICuisinesSliderCardComponentProps<T>
) => React.ReactNode;