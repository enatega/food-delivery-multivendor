import { IGlobalComponentProps } from "./global.interface";

export interface ITabeViewRoute {
  key: string;
  title: string;
}

export interface IOrderTabsComponentProps extends IGlobalComponentProps {
  route: ITabeViewRoute;
}
