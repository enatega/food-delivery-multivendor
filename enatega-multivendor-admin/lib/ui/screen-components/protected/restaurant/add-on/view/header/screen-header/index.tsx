// Interface and Types

// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { IAddonHeaderProps } from '@/lib/utils/interfaces';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

const AddonHeader = ({ setIsAddAddonVisible }: IAddonHeaderProps) => {
  // Hooks
  const t = useTranslations();
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white dark:bg-dark-950 p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Addons')} />
        <TextIconClickable
          className="rounded border dark:border-dark-600 border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={t('Add Add-on')}
          onClick={() => setIsAddAddonVisible(true)}
        />
      </div>
    </div>
  );
};

export default AddonHeader;
