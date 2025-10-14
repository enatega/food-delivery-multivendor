import React from 'react';
// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import CustomTextInput from '@/lib/ui/useable-components/custom-text-input';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';

// Hooks
import { useTranslations } from 'next-intl';

// Types
import { IDropdownSelectItem } from '@/lib/utils/interfaces';

interface UserHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  registrationMethodFilter: IDropdownSelectItem[];
  setRegistrationMethodFilter: (value: IDropdownSelectItem[]) => void;
  accountStatusFilter: IDropdownSelectItem[];
  setAccountStatusFilter: (value: IDropdownSelectItem[]) => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  search,
  setSearch,
  registrationMethodFilter,
  setRegistrationMethodFilter,
  accountStatusFilter,
  setAccountStatusFilter,
}) => {
  // Hooks
  const t = useTranslations();

  const registrationMethodOptions = [
    { id: 1, label: t('Google'), code: 'google' },
    { id: 2, label: t('Apple'), code: 'apple' },
    { id: 3, label: t('Manual'), code: 'default' },
  ];

  const accountStatusOptions = [
    { id: 1, label: t('Active'), code: 'active' },
    { id: 2, label: t('Blocked'), code: 'blocked' },
    { id: 3, label: t('Deactivated'), code: 'deactivated' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleRegistrationMethodChange = (e: IDropdownSelectItem[]) => {
    setRegistrationMethodFilter(e as IDropdownSelectItem[]);
  };

  const handleAccountStatusChange = (e: IDropdownSelectItem[]) => {
    setAccountStatusFilter(e as IDropdownSelectItem[]);
  };

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex flex-col w-full flex-wrap items-start justify-between gap-3">
        <HeaderText text={t('Users')} />
        <div className="flex flex-row flex-wrap w-full items-center gap-3">
          <CustomTextInput
            value={search}
            onChange={handleSearchChange}
            placeholder={t('Search by name or email')}
            className="min-w-[300px] px-2 py-3 border rounded-md"
          />
          <CustomMultiSelectComponent
            name={"registration_method"}
            selectedItems={registrationMethodFilter}
            options={registrationMethodOptions}
            setSelectedItems={(key, items) => handleRegistrationMethodChange(items)}
            placeholder={t('Registration Method')}
            className=" w-min border rounded-md py-1"
            multiSelectClassName='border-none'

          />
          <CustomMultiSelectComponent
            name={"account_status"}
            selectedItems={accountStatusFilter}
            options={accountStatusOptions}
            setSelectedItems={(key, items) => handleAccountStatusChange(items)}
            placeholder={t('Account Status')}
            className=" w-min border rounded-md py-1"
            multiSelectClassName='border-none'

          />
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
