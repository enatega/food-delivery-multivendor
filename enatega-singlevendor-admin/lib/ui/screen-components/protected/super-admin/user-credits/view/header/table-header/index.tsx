// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import { IUserCreditsTableHeaderProps } from '@/lib/utils/interfaces/user-credits.interface';
import { useTranslations } from 'next-intl';

export default function UserCreditsTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  onClearSearch,
}: IUserCreditsTableHeaderProps) {
  // Hooks
  const t = useTranslations();

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="mt-4 flex w-fit items-center gap-2">
        <div className="relative w-60">
          <CustomTextField
            type="text"
            name="keywordFilter"
            maxLength={35}
            showLabel={false}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t('Keyword Search')}
          />
          {globalFilterValue && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
