'use client';

import { useState } from 'react';
import CustomerSupportMain from '@/lib/ui/screen-components/protected/super-admin/customerSupport/view/main';
import CustomerSupportMobilesTabs from '@/lib/ui/screen-components/protected/super-admin/customerSupport/view/mobile-tabs';
import { useTranslations } from 'next-intl';
import HeaderText from '@/lib/ui/useable-components/header-text';

// Types
type CustomerSupportTabType = 'tickets' | 'chats';

export default function CustomerSupportScreen() {
  // Hooks
  const t = useTranslations();
  
  // States
  const [activeTab, setActiveTab] = useState<CustomerSupportTabType>('tickets');
  
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full flex-shrink-0 border-b p-3">
        <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
          <HeaderText text={t('Customer Support')} />
        </div>
      </div>
      
      {/* Mobile tabs for switching between users and tickets */}
      <CustomerSupportMobilesTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {/* Main content area */}
      <CustomerSupportMain 
        activeTab={activeTab}
      />
    </div>
  );
}