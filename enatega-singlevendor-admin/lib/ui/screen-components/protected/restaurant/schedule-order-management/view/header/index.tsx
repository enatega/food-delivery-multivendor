// Components
import { useTranslations } from 'next-intl';

const ScheduleOrderHeader = () => {
  // Hooks
  const t = useTranslations();

  return (
    <div className="w-full flex-shrink-0">
      <div className="flex w-full justify-between">
        <h2 className="text-xl font-semibold dark:text-white">{t('Schedule Order Management')}</h2>
      </div>
    </div>
  );
};

export default ScheduleOrderHeader;
