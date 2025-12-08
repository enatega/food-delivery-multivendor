import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { IOrderSuperAdminHeaderProps } from '@/lib/utils/interfaces';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useRef } from 'react';
import classes from './order-superadmin.header.module.css';
import { IMenuItem } from '@/lib/utils/interfaces/orders/order-vendor.interface';

import { useTranslations } from 'next-intl';
import DateFilterCustomTab from '@/lib/ui/useable-components/date-filter-custom-tab';
import { useTheme } from 'next-themes';

const OrderSuperAdminTableHeader: React.FC<IOrderSuperAdminHeaderProps> = ({
  setSelectedActions,
  selectedActions,
  globalFilterValue,
  onGlobalFilterChange,
  dateFilter,
  handleDateFilter,
}) => {
  // Hooks
  const t = useTranslations();
  const {theme} = useTheme()
  // Refs
  const overlayPanelRef = useRef<OverlayPanel>(null);

  const toggleAction = (action: string) => {
    setSelectedActions((prevActions: string[]) =>
      prevActions.includes(action)
        ? prevActions.filter((a: string) => a !== action)
        : [...prevActions, action]
    );
  };

  const menuItems: IMenuItem[] = [
    { label: t('PENDING'), value: 'PENDING' },
    { label: t('ACCEPTED'), value: 'ACCEPTED' },
    { label: t('ASSIGNED'), value: 'ASSIGNED' },
    { label: t('PICKED'), value: 'PICKED' },
    { label: t('DELIVERED'), value: 'DELIVERED' },
    { label: t('CANCELLED'), value: 'CANCELLED' },
  ];

  return (
    <div className="mb-4 flex flex-col gap-6">
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
            name="riderFilter"
            maxLength={35}
            className="w-64"
            showLabel={false}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t('Search Orders')}
          />
        </div>

        <div className="hidden sm:block">
          <TextIconClickable
            className="w-44 rounded border border-dotted border-[#E4E4E7] dark:border-dark-600 text-black dark:text-white"
            icon={faAdd}
            iconStyles={theme === 'dark' ? { color: 'white' } : { color: 'black' }}
            title={t('Orders Status')}
            onClick={(e) => overlayPanelRef.current?.toggle(e)}
          />
        </div>

        <DateFilterCustomTab
          options={[
            t('All'),
            t('Today'),
            t('Week'),
            t('Month'),
            t('Year'),
            'Custom',
          ]}
          selectedTab={dateFilter.dateKeyword}
          setSelectedTab={(tab: string) =>
            handleDateFilter({ ...dateFilter, dateKeyword: tab })
          }
        />

        <OverlayPanel ref={overlayPanelRef} dismissable>
          <div className="w-60">
            <div className="border-b border-t py-1">
              {menuItems.map((item, index) => (
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

export default OrderSuperAdminTableHeader;
