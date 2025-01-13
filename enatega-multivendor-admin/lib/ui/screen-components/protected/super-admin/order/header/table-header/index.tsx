import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { IOrderSuperAdminHeaderProps } from '@/lib/utils/interfaces';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useRef } from 'react';
import classes from './order-superadmin.header.module.css';
import { IMenuItem } from '@/lib/utils/interfaces/orders/order-vendor.interface';
import VendorCustomTab from '@/lib/ui/useable-components/vendor-custom-tab';

const OrderSuperAdminTableHeader: React.FC<IOrderSuperAdminHeaderProps> = ({
  setSelectedActions,
  selectedActions,
  globalFilterValue,
  onGlobalFilterChange,
  dateFilter,
  handleDateFilter,
}) => {
  const overlayPanelRef = useRef<OverlayPanel>(null);

  const toggleAction = (action: string) => {
    setSelectedActions((prevActions: string[]) =>
      prevActions.includes(action)
        ? prevActions.filter((a: string) => a !== action)
        : [...prevActions, action]
    );
  };

  const menuItems: IMenuItem[] = [
    { label: 'PENDING', value: 'PENDING' },
    { label: 'ACCEPTED', value: 'ACCEPTED' },
    { label: 'ASSIGNED', value: 'ASSIGNED' },
    { label: 'PICKED', value: 'PICKED' },
    { label: 'DELIVERED', value: 'DELIVERED' },
    { label: 'CANCELLED', value: 'CANCELLED' },
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
            placeholder="Search Orders"
          />
        </div>

        <div className="hidden sm:block">
          <TextIconClickable
            className="w-44 rounded border border-dotted border-[#E4E4E7] text-black"
            icon={faAdd}
            iconStyles={{ color: 'black' }}
            title="Orders Status.."
            onClick={(e) => overlayPanelRef.current?.toggle(e)}
          />
        </div>

        <VendorCustomTab
          options={['All', 'Today', 'Week', 'Month', 'Year', 'Custom']}
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
              Clear filters
            </p>
          </div>
        </OverlayPanel>
      </div>
    </div>
  );
};

export default OrderSuperAdminTableHeader;
