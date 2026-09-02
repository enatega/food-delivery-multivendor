import { useState } from 'react';
import UserHeader from '@/lib/ui/screen-components/protected/super-admin/users/view/header/screen-header';
import UsersMain from '@/lib/ui/screen-components/protected/super-admin/users/view/main';
import useDebounce from '@/lib/hooks/useDebounce';
import { IDropdownSelectItem } from '@/lib/utils/interfaces';

export default function UsersScreen() {
  const [search, setSearch] = useState('');
  const [registrationMethodFilter, setRegistrationMethodFilter] = useState<IDropdownSelectItem[]>([]);
  const [accountStatusFilter, setAccountStatusFilter] = useState<IDropdownSelectItem[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  return (
    <div className="flex h-[90vh] flex-col overflow-auto">
      <UserHeader
        search={search}
        setSearch={setSearch}
        registrationMethodFilter={registrationMethodFilter}
        setRegistrationMethodFilter={setRegistrationMethodFilter}
        accountStatusFilter={accountStatusFilter}
        setAccountStatusFilter={setAccountStatusFilter}
      />

      <UsersMain
        debouncedSearch={debouncedSearch}
        registrationMethodFilter={registrationMethodFilter}
        accountStatusFilter={accountStatusFilter}
      />
    </div>
  );
}
