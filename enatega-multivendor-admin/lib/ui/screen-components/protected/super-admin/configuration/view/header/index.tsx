// Components
import HeaderText from '@/lib/ui/useable-components/header-text';

// Hooks
import { useTranslations } from 'next-intl';

const ConfigHeader = () => {
  // Hooks
  const t = useTranslations();
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text={t('Configurations')} />
      </div>
    </div>
  );
};

export default ConfigHeader;
