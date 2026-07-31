// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { IZoneHeaderProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

const ZoneHeader = ({ onSetAddFormVisible }: IZoneHeaderProps) => {
  // Hooks
  const t = useTranslations();
  return (
    <div className="w-full flex-shrink-0">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Zone')} />
        <TextIconClickable
          className="rounded border-gray-300  border dark:border-dark-600 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={t('Add Zone')}
          onClick={() => onSetAddFormVisible()}
        />
      </div>
    </div>
  );
};

export default ZoneHeader;
