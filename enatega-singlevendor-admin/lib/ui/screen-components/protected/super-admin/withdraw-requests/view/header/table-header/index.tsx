// CSS
import classes from './table-header.module.css';

// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { IWithdrawRequestsTableHeaderProps } from '@/lib/utils/interfaces';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';

// Prime react
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes';

interface FilterOption {
  label: string;
  value: string;
  type: 'status' | 'userType';
}

export default function WithdrawRequestSuperAdminTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  selectedActions,
  setSelectedActions,
}: IWithdrawRequestsTableHeaderProps) {
  // Refs
  // const statusOverlayRef = useRef<OverlayPanel>(null);
  const userTypeOverlayRef = useRef<OverlayPanel>(null);

  // States
  const [searchValue, setSearchValue] = useState('');

  // Translations
  const t = useTranslations();
  const {theme} = useTheme()
  const filterOptions: FilterOption[] = [
    // {
    //   label: 'Transferred',
    //   value: 'TRANSFERRED',
    //   type: 'status',
    // },
    // {
    //   label: 'Cancelled',
    //   value: 'CANCELLED',
    //   type: 'status',
    // },
    // {
    //   label: 'Requested',
    //   value: 'REQUESTED',
    //   type: 'status',
    // },
    {
      label: t('Rider'),
      value: 'RIDER',
      type: 'userType',
    },
    {
      label: t('Store'),
      value: 'STORE',
      type: 'userType',
    },
  ];

  const toggleFilter = (option: FilterOption) => {
    const currentFilters = [...selectedActions];
    const sameTypeFilters = currentFilters.filter(
      (filter) =>
        filterOptions.find((opt) => opt.value === filter)?.type === option.type
    );

    if (sameTypeFilters.includes(option.value)) {
      setSelectedActions(
        currentFilters.filter((filter) => filter !== option.value)
      );
    } else {
      const newFilters = currentFilters.filter(
        (filter) =>
          filterOptions.find((opt) => opt.value === filter)?.type !==
          option.type
      );
      setSelectedActions([...newFilters, option.value]);
    }
  };

  const getFilteredOptions = (type: 'status' | 'userType') => {
    return filterOptions.filter(
      (option) =>
        option.type === type &&
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const clearTypeFilters = (type: 'status' | 'userType') => {
    setSelectedActions(
      selectedActions.filter(
        (action) =>
          filterOptions.find((opt) => opt.value === action)?.type !== type
      )
    );
  };

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="vendorFilter"
            maxLength={35}
            showLabel={false}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t('Keyword Search')}
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3"
          />
        </div>

        {/* User Type Filter */}
        <div className="mx-4 flex items-center">
          <TextIconClickable
            className={`${selectedActions.find(
              (action) =>
                filterOptions.find((opt) => opt.value === action)?.type ===
                'status'
            )
              } rounded border border-dotted dark:border-dark-600 border-[#E4E4E7] text-black dark:text-white transition-all`}
            icon={faAdd}
            iconStyles={theme === 'dark' ? { color: 'white' } : { color: 'dark' }}
            title={
              (() => {
                const selected = selectedActions.find((Action) => filterOptions.find((opt) => opt.value === Action)?.type === "userType")

                const MatchedOption = filterOptions.find(opt => opt.value === selected)

                return MatchedOption ? MatchedOption.label : t("User")

              })()
            }
            onClick={(e) => userTypeOverlayRef.current?.toggle(e)}
          />

          <OverlayPanel ref={userTypeOverlayRef} dismissable>
            <div className="w-60">
              <div className="mb-3">
                <CustomTextField
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t('Search')}
                  className="h-8 w-full"
                  type="text"
                  name="search"
                  showLabel={false}
                />
              </div>

              <div className="border-b border-t py-1">
                {getFilteredOptions('userType').map((option, index) => (
                  <div
                    key={index}
                    className={`${classes.filter} my-2 flex items-center justify-between`}
                  >
                    <div className="flex">
                      <Checkbox
                        inputId={`userType-${option.value}`}
                        checked={selectedActions.includes(option.value)}
                        onChange={() => toggleFilter(option)}
                        className={`${classes.checkbox}`}
                      />
                      <label
                        htmlFor={`userType-${option.value}`}
                        className="ml-1 text-sm"
                      >
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <p
                className="mt-3 cursor-pointer text-center text-sm"
                onClick={() => clearTypeFilters('userType')}
              >
                {t('Clear filters')}
              </p>
            </div>
          </OverlayPanel>
        </div>
      </div>
    </div>
  );
}
