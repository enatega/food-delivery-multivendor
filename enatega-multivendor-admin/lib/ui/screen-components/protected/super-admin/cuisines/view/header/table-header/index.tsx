// CSS
import classes from './table-header.module.css';

// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { ICuisineTableHeaderProps } from '@/lib/utils/interfaces/cuisine.interface';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

// Prime react
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useState } from 'react';

export default function CuisineTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  selectedActions,
  setSelectedActions,
}: ICuisineTableHeaderProps) {
  // Hooks
  const t = useTranslations();
  const {theme } = useTheme()

  //Ref
  const overlayPanelRef = useRef<OverlayPanel>(null);

  // States
  const [searchValue, setSearchValue] = useState('');

  // Handle checkbox toggle
  const toggleAction = (action: string) => {
    const updatedActions = selectedActions.includes(action)
      ? selectedActions.filter((a) => a !== action)
      : [...selectedActions, action];
    setSelectedActions(updatedActions);
  };

  const menuItems = [
    {
      label: t('Restaurant'),
      value: 'restaurant',
    },
    {
      label: t('Grocery'),
      value: 'grocery',
    },
  ];

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
          />
        </div>
        <div className="flex items-center">
          <OverlayPanel ref={overlayPanelRef} dismissable>
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
                {menuItems
                  .filter((item) =>
                    item.label.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      className={`${classes.filter} my-2 flex items-center justify-between`}
                    >
                      <div className="flex">
                        <Checkbox
                          inputId={`action-${item.value}`}
                          checked={selectedActions.includes(item.value)}
                          onChange={() => toggleAction(item.value)}
                          className={`${classes.checkbox}`}
                        />
                        <label
                          htmlFor={`action-${item.value}`}
                          className="ml-1 text-sm"
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

          <TextIconClickable
            className="w-20 rounded border border-dotted border-[#E4E4E7] text-black dark:text-white"
            icon={faAdd}
           iconStyles={theme === 'dark' ? { color: 'white' } : { color: 'black' }}
            title={selectedActions.length > 0 ? t('Filter') : t('Actions')}
            onClick={(e) => overlayPanelRef.current?.toggle(e)}
          />
        </div>
      </div>
    </div>
  );
}
