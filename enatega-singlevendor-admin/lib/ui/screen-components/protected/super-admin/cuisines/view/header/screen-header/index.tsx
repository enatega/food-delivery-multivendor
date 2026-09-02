// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Interfaces
import { ICuisineScreenHeaderProps } from '@/lib/utils/interfaces/cuisine.interface';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

export default function CuisineScreenHeader({
  handleButtonClick,
}: ICuisineScreenHeaderProps) {
  // Hooks
  const t = useTranslations();

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white dark:bg-dark-950 p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Cuisines')} />
        <TextIconClickable
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          onClick={handleButtonClick}
          title={t('Add Cuisines')}
          className="rounded border-gray-300 border dark:border-dark-600 bg-black text-white sm:w-auto"
        />
      </div>
    </div>
  );
}
