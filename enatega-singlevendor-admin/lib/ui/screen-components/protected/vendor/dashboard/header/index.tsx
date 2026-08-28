import { ProfileContext } from '@/lib/context/vendor/profile.context';
import { useTranslations } from 'next-intl';
import React, { useContext } from 'react';

export default function DashboardHeader() {
  const { vendorProfileResponse } = useContext(ProfileContext);
  // Hooks
  const t = useTranslations();

  return (
    <div className="m-3">
      <div className="rounded-lg dark:bg-dark-950 bg-[#F4F4F5]">
        <div className="flex h-20 items-center pl-[1rem]">
          <span className="text-[32px] font-[500] dark:text-white text-[#09090B]">
            {vendorProfileResponse?.data?.getVendor?.name
              ? `${t('Hi')} ${vendorProfileResponse?.data?.getVendor.name},`
              : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
