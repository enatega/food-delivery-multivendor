// Custom Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import { useTranslations } from 'next-intl';

const ProfileHeader: React.FC = () => {
  // Hooks
  const t = useTranslations();
  return (
    <div className="top-0 z-10 w-full flex-shrink-0 bg-white dark:bg-dark-950 p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text={t('Profile')} />
      </div>
    </div>
  );
};

export default ProfileHeader;
