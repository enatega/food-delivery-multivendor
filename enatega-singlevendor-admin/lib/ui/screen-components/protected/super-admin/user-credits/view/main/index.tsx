// GraphQL
import { GET_ALL_CREDITS_RECORDS } from '@/lib/api/graphql/queries/user-credits';
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';

// Interfaces
import { IActionMenuItem, ILazyQueryResult } from '@/lib/utils/interfaces';
import {
  ICreditHistory,
  ICreditsMainProps,
  IGetAllCreditsRecordsData,
  IGetAllCreditsRecordsVars,
} from '@/lib/utils/interfaces/user-credits.interface';
import { IFilterType } from '@/lib/utils/interfaces/table.interface';

// Prime react
import { FilterMatchMode } from 'primereact/api';

// Hooks
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Table from '@/lib/ui/useable-components/table';
import UserCreditsTableHeader from '../header/table-header';
import { USER_CREDITS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/user-credits-columns';

export default function UserCreditsMain({
  setEditData,
  setOpen,
  refetch,
}: ICreditsMainProps) {
  // Hooks
  const t = useTranslations();

  // States
  const [selectedData, setSelectedData] = useState<ICreditHistory[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Filters - Empty since we're using server-side search via API
  const filters: IFilterType = {
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
  };

  // Queries
  const { data, fetch, loading } = useLazyQueryQL(GET_ALL_CREDITS_RECORDS, {
    fetchPolicy: 'no-cache',
    debounceMs: 300,
    onCompleted: () => {
      if (initialLoading) {
        setInitialLoading(false);
      }
      setIsSearching(false);
    },
  }) as ILazyQueryResult<
    IGetAllCreditsRecordsData | undefined,
    IGetAllCreditsRecordsVars
  >;

  // Menu Items
  const menuItems: IActionMenuItem<ICreditHistory>[] = [
    {
      label: t('Edit Amount'),
      command: (data?: ICreditHistory) => {
        if (data) {
          setEditData(data);
          setOpen(true);
        }
      },
    },
  ];

  // Function to fetch credit records with search term
  const fetchCreditRecords = (term?: string) => {
    const searchValue = term ?? searchTerm;
    return fetch({ searchTerm: searchValue });
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCreditRecords('');
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch when searchTerm changes (only after initial load)
  // The useLazyQueryQL hook handles debouncing internally
  useEffect(() => {
    if (isInitialized) {
      setIsSearching(true);
      fetchCreditRecords(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Expose the fetch function to parent via refetch prop
  useEffect(() => {
    if (refetch) {
      refetch(fetchCreditRecords);
    }
  }, [refetch]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setGlobalFilterValue(value);
    setSearchTerm(value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setGlobalFilterValue('');
    setSearchTerm('');
  };

  return (
    <div className="p-3">
      <UserCreditsTableHeader
        globalFilterValue={globalFilterValue}
        onGlobalFilterChange={(e) => handleSearchChange(e.target.value)}
        onClearSearch={handleClearSearch}
      />
      <Table
        columns={USER_CREDITS_TABLE_COLUMNS({ menuItems })}
        data={data?.getAllCreditsRecords || []}
        selectedData={selectedData}
        setSelectedData={(e) => setSelectedData(e)}
        loading={initialLoading || (isSearching && loading)}
        filters={filters}
      />
    </div>
  );
}
