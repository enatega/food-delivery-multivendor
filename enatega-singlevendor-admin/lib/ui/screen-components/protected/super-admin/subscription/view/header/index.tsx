// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

interface ISubscriptionHeaderProps {
  handleButtonClick: () => void;
}

export default function SubscriptionHeader({
  handleButtonClick,
}: ISubscriptionHeaderProps) {
  // Hooks
  const t = useTranslations();

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white dark:bg-dark-950 p-3 ">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Manage subscription plans')} />
        <TextIconClickable
          className="rounded border-gray-300 dark:border-dark-600 bg-black dark:bg-primary-color text-white sm:w-auto hover:bg-gray-800 dark:hover:bg-primary-dark"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          onClick={handleButtonClick}
          title={t('Add New plan')}
        />
      </div>
    </div>
  );
}
