import React, { useRef, useState } from 'react';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { ICommissionRateHeaderProps } from '@/lib/utils/interfaces';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import classes from './ratings.header.module.css';
import { useTranslations } from 'next-intl';

interface MenuItem {
  label: string;
  value: string;
}

const RatingsHeaderDataView: React.FC<ICommissionRateHeaderProps> = ({
  setSelectedActions,
  selectedActions,
  onSearch,
}) => {
  // Hooks
  const t = useTranslations();

  // States
  const [searchValue, setSearchValue] = useState<string>('');

  // Refs
  const overlayPanelRef = useRef<OverlayPanel>(null);

  const toggleAction = (action: string) => {
    setSelectedActions((prevActions: string[]) =>
      prevActions.includes(action)
        ? prevActions.filter((a: string) => a !== action)
        : [...prevActions, action]
    );
  };

  const menuItems: MenuItem[] = [
    { label: t('1-2 stars'), value: '1-2 stars' },
    { label: t('3-4 stars'), value: '3-4 stars' },
    { label: t('5 stars'), value: '5 stars' },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div className="mb-4 flex gap-x-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full flex-row items-center gap-4 sm:w-auto sm:flex-col">
          <div className="sm:hidden">
            <TextIconClickable
              className="flex h-10 w-10 items-center justify-center rounded-full border border-dotted border-[#E4E4E7]"
              icon={faAdd}
              iconStyles={{ color: 'black' }}
              onClick={(e) => overlayPanelRef.current?.toggle(e)}
            />
          </div>

          <CustomTextField
            type="text"
            name="vendorFilter"
            maxLength={35}
            className="w-64"
            showLabel={false}
            placeholder={t('Keyword search')}
            value={searchValue}
            onChange={handleSearch}
          />
        </div>

        <div className="hidden sm:block">
          <TextIconClickable
            className="w-44 rounded border border-dotted border-[#E4E4E7] text-black bg-white dark:bg-dark-950"
            icon={faAdd}
            iconStyles={{ color: 'black' }}
            title={t('Filter Ratings')}
            onClick={(e) => overlayPanelRef.current?.toggle(e)}
          />
        </div>

        <OverlayPanel ref={overlayPanelRef} dismissable>
          <div className="w-60">
            <div className="border-b border-t py-1">
              {menuItems
                .filter((item) =>
                  item.label.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className={`${classes.filter} my-2 flex items-center justify-between`}
                  >
                    <div className="flex items-center">
                      <Checkbox
                        inputId={`action-${item.value}`}
                        checked={selectedActions.includes(item.value)}
                        onChange={() => toggleAction(item.value)}
                        className={`${classes.checkbox}`}
                      />
                      <label
                        htmlFor={`action-${item.value}`}
                        className="ml-2 text-sm"
                      >
                        {item.label}
                      </label>
                    </div>
                  </div>
                ))}
            </div>
            <p
              className="mt-3 cursor-pointer text-center text-sm"
              onClick={() => setSelectedActions([])}
            >
              {t('Clear filters')}
            </p>
          </div>
        </OverlayPanel>
      </div>
    </div>
  );
};

export default RatingsHeaderDataView;
