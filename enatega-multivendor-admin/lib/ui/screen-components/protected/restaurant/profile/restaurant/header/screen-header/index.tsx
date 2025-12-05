import React, { useContext } from 'react';

import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { ProfileContext } from '@/lib/context/restaurant/profile.context';
import { useTranslations } from 'next-intl';

const ProfileHeader: React.FC = () => {
  // Hooks
  const t = useTranslations();

  // Contexts
  const profileContext = useContext(ProfileContext);

  const onUpdateProfileClick = () => {
    profileContext?.handleUpdateProfile();
  };

  return (
    <div className="w-full flex-shrink-0 top-0 bg-white dark:bg-dark-950 z-10 shadow-sm p-3">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text={t('Profile')} />
        <TextIconClickable
          className="sm:w-auto bg-black text-white border-gray-300 rounded"
          icon={faWrench}
          iconStyles={{ color: 'white' }}
          title={t('Update Profile')}
          onClick={onUpdateProfileClick}
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
