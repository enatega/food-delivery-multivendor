// Path: /index.tsx/mobile-tabs/view/customerSupport/super-admin/protected/screen-components/ui/lib

import { useTranslations } from 'next-intl';

// Interface
export interface ICustomerSupportMobileTabsProps {
  activeTab: 'tickets' | 'chats';
  setActiveTab: (tab: 'tickets' | 'chats') => void;
}

export default function CustomerSupportMobilesTabs({
  activeTab,
  setActiveTab,
}: ICustomerSupportMobileTabsProps) {
  // Hooks
  const t = useTranslations();

  return (
    <div className="flex border-b bg-gray-100 dark:bg-dark-950 sm:hidden">
      <button
        className={`flex-1 px-4 py-2 text-center ${
          activeTab === 'tickets'
            ? 'border-b-2 border-black bg-white dark:bg-dark-950 font-bold'
            : ''
        }`}
        onClick={() => setActiveTab('tickets')}
      >
        {t('Users')}
      </button>
      <button
        className={`flex-1 px-4 py-2 text-center ${
          activeTab === 'chats'
            ? 'border-b-2 border-black dark:border-dark-600 bg-white dark:bg-dark-950 font-bold'
            : ''
        }`}
        onClick={() => setActiveTab('chats')}
      >
        {t('Tickets')}
      </button>
    </div>
  );
}
