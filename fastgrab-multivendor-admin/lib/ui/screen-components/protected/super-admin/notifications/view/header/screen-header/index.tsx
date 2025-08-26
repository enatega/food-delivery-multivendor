//Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { INotificationHeaderProps } from '@/lib/utils/interfaces/notification.interface';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

export default function NotificationHeader({
  handleButtonClick,
}: INotificationHeaderProps) {
  // Hooks
  const t = useTranslations();

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Notification')} />
        <TextIconClickable
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          onClick={handleButtonClick}
          title={t('Send Notification')}
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
        />
      </div>
    </div>
  );
}
