export interface IBannerItemProps {
  item: {
    _id: string;
    title: string;
    description: string;
    action: string;
    screen: string;
    file: string;
    parameters?: string[];
    shopType?: string;
    slug?: string;
  }
}

export interface IBanner {
  __typename?: string;
  _id: string;
  title: string;
  description: string;
  action: string;
  screen: string;
  file: string;
  parameters?: string[];
  shopType?: string;
  slug?: string;
}

export interface IGetBannersResponse {
  banners: IBanner[];
}