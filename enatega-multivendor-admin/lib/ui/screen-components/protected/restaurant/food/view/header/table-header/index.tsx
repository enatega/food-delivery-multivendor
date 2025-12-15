// Custom Components
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces
import { IFoodTableHeaderProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function FoodsTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  onClearFilter,
}: IFoodTableHeaderProps) {
  // Hooks
  const t = useTranslations();

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-col md:flex-row flex w-fit items-center gap-2">
        <div className="relative w-72">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="foodFilter"
            maxLength={50}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t('Search products...')}
            className="w-full h-10 pl-10 pr-10 text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition-all"
          />
          {globalFilterValue && (
            <button
              type="button"
              onClick={onClearFilter}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label={t('Clear search')}
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
