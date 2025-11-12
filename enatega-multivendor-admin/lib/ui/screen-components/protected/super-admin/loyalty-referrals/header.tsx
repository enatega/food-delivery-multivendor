'use client';

import { useLoyaltyContext } from '@/lib/hooks/useLoyalty';
import HeaderText from '@/lib/ui/useable-components/header-text';
import CustomTab from '@/lib/ui/useable-components/vendor-custom-tab';
import { LoyaltyType } from '@/lib/utils/types/loyalty';
import { useState } from 'react';

export default function LoyaltyAndReferralHeader() {
  // Hooks
  const { loyaltyType, setLoyaltyType } = useLoyaltyContext();

  return (
    <div className="p-3 space-y-6">
      {/* Header with Title and Tabs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <HeaderText text="Loyalty and Referrals" />
          <div className="flex gap-4">
            <CustomTab
              options={['Customer Loyalty Program', 'Driver Loyalty Program']}
              selectedTab={loyaltyType}
              setSelectedTab={(tab) => setLoyaltyType(tab as LoyaltyType)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
