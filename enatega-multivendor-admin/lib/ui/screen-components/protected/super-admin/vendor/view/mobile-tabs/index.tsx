// Interface
import { IVendorMobileTabsComponentProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export default function VendorMobilesTabs({
  activeTab,
  setActiveTab,
}: IVendorMobileTabsComponentProps) {
  // Hooks
  const t = useTranslations();
  return (
    <div className="flex border-b bg-gray-100 sm:hidden">
      <button
        className={`flex-1 px-4 py-2 text-center ${
          activeTab === 'vendors'
            ? 'border-b-2 border-black bg-white font-bold'
            : ''
        }`}
        onClick={() => setActiveTab('vendors')}
      >
        {t('Vendors')}
      </button>
      <button
        className={`flex-1 px-4 py-2 text-center ${
          activeTab === 'restaurants'
            ? 'border-b-2 border-black bg-white font-bold'
            : ''
        }`}
        onClick={() => setActiveTab('restaurants')}
      >
        {t('Stores')}
      </button>
    </div>
  );
}
