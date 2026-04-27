// Components
import HeaderText from '@/lib/ui/useable-components/header-text';

// Hooks
import { useTranslations } from 'next-intl';

const OrdersSuperAdminHeader = () => {
  // Hooks
  const t = useTranslations();

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white dark:bg-dark-950 p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Orders')} />
      </div>
    </div>
  );
};

export default OrdersSuperAdminHeader;
