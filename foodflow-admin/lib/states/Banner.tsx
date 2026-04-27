import { ReactNode, useState } from 'react';
import { IBannersResponse, IBannerRenderProps } from '../utils/interfaces';

const BannerStateProvider = ({
  render,
}: {
  render: (props: IBannerRenderProps) => ReactNode;
}) => {
  const [isAddBannerVisible, setIsAddBannerVisible] = useState(false);
  const [banner, setBanner] = useState<IBannersResponse | null>(null);

  return render({
    isAddBannerVisible,
    setIsAddBannerVisible,
    banner,
    setBanner,
  });
};

export default BannerStateProvider;
