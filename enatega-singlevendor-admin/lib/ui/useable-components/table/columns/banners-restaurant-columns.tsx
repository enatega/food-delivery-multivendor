// Core
import Image from 'next/image';
// Custom Components
import ActionMenu from '@/lib/ui/useable-components/action-menu';
// Interfaces and Types
import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { IBannerRestaurantResponse } from '@/lib/utils/interfaces/banner.restaurant.interface';
import { useTranslations } from 'next-intl';

export const BANNER_RESTAURANT_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IBannerRestaurantResponse>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  return [
    {
      headerName: t('Image'),
      propertyName: 'image',
      body: (product: IBannerRestaurantResponse) => {
        if (product.file && product.file.includes('video')) {
          return (
            <video
              autoPlay
              src={product.displayImage || product.file}
              width={40}
              height={40}
              loop
              muted
            />
          );
        } else {
          return (
            <Image
              width={40}
              height={40}
              alt="Banner"
              src={
                product.displayImage || product.file || 
                'https://images.unsplash.com/photo-1595418917831-ef942bd9f9ec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
            />
          );
        }
      },
    },
    { headerName: t('Title'), propertyName: 'title' },
    { headerName: t('Description'), propertyName: 'description' },
    { headerName: t('Food'), propertyName: 'foodTitle' },
    {
      propertyName: 'actions',
      body: (banner: IBannerRestaurantResponse) => (
        <ActionMenu items={menuItems} data={banner} />
      ),
    },
  ];
};