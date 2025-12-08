// Interface and Types
import { IBannersHeaderComponentsProps } from '@/lib/utils/interfaces/banner.interface';

// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

const BannersHeader = ({
  setIsAddBannerVisible,
}: IBannersHeaderComponentsProps) => {
  // Hooks
  const t = useTranslations();
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white dark:bg-dark-950 p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Banners')} />
        <TextIconClickable
          className="rounded border-gray-300 border dark:border-dark-600 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={t('Add Banner')}
          onClick={() => setIsAddBannerVisible(true)}
        />
      </div>
    </div>
  );
};

export default BannersHeader;
