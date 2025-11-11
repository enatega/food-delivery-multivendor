'use client';

import HeaderText from '@/lib/ui/useable-components/header-text';
import VendorCustomTab from '@/lib/ui/useable-components/vendor-custom-tab';
import type React from 'react';

import { useState } from 'react';

interface ProgramTabsProps {
  children?: React.ReactNode;
}

type LoyaltyType = 'Customer Loyalty Program' | 'Driver Loyalty Program';

export default function LoyaltyAndReferralHeader() {
  const [activeTab, setActiveTab] = useState<LoyaltyType>(
    'Customer Loyalty Program'
  );

  return (
    <div className="p-3 space-y-6">
      {/* Header with Title and Tabs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <HeaderText text="Loyalty and Referrals" />
          <div className="flex gap-4">
            <VendorCustomTab
              options={['Customer Loyalty Program', 'Driver Loyalty Program']}
              selectedTab={activeTab}
              setSelectedTab={(tab) => setActiveTab(tab as LoyaltyType)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
