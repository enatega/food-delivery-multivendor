'use client';

import { useContext } from 'react';
import { ProfileContext } from '@/lib/context/vendor/profile.context';
import ProfileHeader from '@/lib/ui/screen-components/protected/vendor/profile/header/screen-header';
import VendorMain from '@/lib/ui/screen-components/protected/vendor/profile/main';
import VendorUpdateForm from '@/lib/ui/screen-components/protected/vendor/profile/add-form';

export default function ProfileScreen() {
  const { isUpdateProfileVisible, setIsUpdateProfileVisible } =
    useContext(ProfileContext);

  return (
    <div className="screen-container p-4">
      <ProfileHeader />
      <VendorMain />

      <VendorUpdateForm
        vendorFormVisible={isUpdateProfileVisible}
        setIsUpdateProfileVisible={setIsUpdateProfileVisible}
      />
    </div>
  );
}
