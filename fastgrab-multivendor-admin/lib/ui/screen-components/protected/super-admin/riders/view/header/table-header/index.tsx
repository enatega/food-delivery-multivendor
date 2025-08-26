// Custom Components
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces
import { IRidersTableHeaderProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export default function RidersTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: IRidersTableHeaderProps) {
  // Hooks
  const t = useTranslations();

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="riderFilter"
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
