import { Dispatch, SetStateAction } from 'react';
import { IDateFilter } from './dashboard.interface';
import { IGlobalComponentProps } from './global.interface';

interface ITabsItem {
  name: string;
  icon: string;
}

export interface IHeaderTabsItem extends ITabsItem {}

export interface IVendorCustomTabProps extends IGlobalComponentProps {
  options: string[];
  selectedTab: string | undefined;
  setSelectedTab: (tab: string) => void;
  dateFilter?: IDateFilter;
  setDateFilter?: Dispatch<SetStateAction<IDateFilter>>;
}

export interface ICustomTabProps extends IGlobalComponentProps {
  options: string[];
  selectedTab: string | undefined;
  setSelectedTab: (tab: string) => void;
  dateFilter?: IDateFilter;
  setDateFilter?: Dispatch<SetStateAction<IDateFilter>>;
}
