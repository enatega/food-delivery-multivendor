import HeaderText from '@/lib/ui/useable-components/header-text';
import { useTranslations } from 'next-intl';

const RatingsHeader = () => {
  // Hooks
  const t = useTranslations();
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white dark:bg-dark-950 p-3 shadow-sm dark:shadow-dark-600">
      <div className="flex w-full justify-between dark:text-white">
        <HeaderText text={t('Ratings')} />
      </div>
    </div>
  );
};

export default RatingsHeader;
