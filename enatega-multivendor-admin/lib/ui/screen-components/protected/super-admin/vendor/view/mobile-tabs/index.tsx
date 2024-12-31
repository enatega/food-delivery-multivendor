// Interface
import { IVendorMobileTabsComponentProps } from '@/lib/utils/interfaces';

export default function VendorMobilesTabs({
  activeTab,
  setActiveTab,
}: IVendorMobileTabsComponentProps) {
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
        Vendors
      </button>
      <button
        className={`flex-1 px-4 py-2 text-center ${
          activeTab === 'restaurants'
            ? 'border-b-2 border-black bg-white font-bold'
            : ''
        }`}
        onClick={() => setActiveTab('restaurants')}
      >
        Stores
      </button>
    </div>
  );
}
