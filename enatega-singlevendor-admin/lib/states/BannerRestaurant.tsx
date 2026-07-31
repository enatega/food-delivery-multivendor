import { ReactNode, useState } from 'react';
import { IBannerRestaurantResponse } from '../utils/interfaces/banner.restaurant.interface';

interface IBannerRestaurantRenderProps {
  isAddBannerVisible: boolean;
  banner: IBannerRestaurantResponse | null;
  setIsAddBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setBanner: React.Dispatch<React.SetStateAction<IBannerRestaurantResponse | null>>;
}

interface IBannerRestaurantStateProviderProps {
  render: (props: IBannerRestaurantRenderProps) => ReactNode;
}

const BannerRestaurantStateProvider = ({
  render,
}: IBannerRestaurantStateProviderProps) => {
  const [isAddBannerVisible, setIsAddBannerVisible] = useState(false);
  const [banner, setBanner] = useState<IBannerRestaurantResponse | null>(null);

  return render({
    isAddBannerVisible,
    setIsAddBannerVisible,
    banner,
    setBanner,
  });
};

export default BannerRestaurantStateProvider;