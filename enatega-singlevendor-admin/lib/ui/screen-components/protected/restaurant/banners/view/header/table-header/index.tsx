// Custom Components
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces and Types
import { IBannerRestaurantTableHeaderProps } from '@/lib/utils/interfaces/banner.restaurant.interface';
import { useTranslations } from 'next-intl';

export default function BannerRestaurantTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: IBannerRestaurantTableHeaderProps) {
  // Hooks
  const t = useTranslations();
  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="bannerFilter"
            maxLength={35}
            showLabel={false}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t('Keyword Search')}
          />
        </div>
      </div>
    </div>
  );
}