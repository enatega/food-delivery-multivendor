// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces
import { ICuisineTableHeaderProps } from '@/lib/utils/interfaces/cuisine.interface';
import { useTranslations } from 'next-intl';

export default function NotificationTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: ICuisineTableHeaderProps) {
  // Hooks
  const t = useTranslations();

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="vendorFilter"
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
