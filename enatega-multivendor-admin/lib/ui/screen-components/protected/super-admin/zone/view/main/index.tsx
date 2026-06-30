// Core
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

// Interface and Types
import {
  IZoneResponse,
  IZonesPaginatedResponse,
  IActionMenuItem,
  IQueryResult,
  IZoneMainComponentsProps,
} from '@/lib/utils/interfaces';

// Context
import { useConfiguration } from '@/lib/hooks/useConfiguration';


// UI Components
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import RidersTableHeader from '../header/table-header';

// Constants and Interfaces
import { ZONE_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/zone-columns';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import useDebounce from '@/lib/hooks/useDebounce';

// GraphQL and Utilities
import { DELETE_ZONE, GET_ZONES_PAGINATED } from '@/lib/api/graphql';

// Data
import { useTranslations } from 'next-intl';

export default function ZoneMain({
  setIsAddZoneVisible,
  setZone,
}: IZoneMainComponentsProps) {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();
  const { ISPAID_VERSION } = useConfiguration();
  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IZoneResponse[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(globalFilterValue, 500);

  // Query
  const { data, loading } = useQueryGQL(GET_ZONES_PAGINATED, {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
  }, {
    fetchPolicy: 'network-only',
  }) as IQueryResult<IZonesPaginatedResponse | undefined, undefined>;

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_ZONE,
    {
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    }
  );

  // For global search
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const menuItems: IActionMenuItem<IZoneResponse>[] = [
    {
      label: t('Edit'),
      command: (data?: IZoneResponse) => {
        if (data) {
          setIsAddZoneVisible(true);
          setZone(data); // Zone here
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IZoneResponse) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

  const handleDeleteZone = async () => {
    if (ISPAID_VERSION) {
      await mutateDelete({
        variables: { id: deleteId },
        onCompleted: () => {
          showToast({
            type: 'success',
            title: t('Delete Zone'),
            message: t('Zone has been deleted successfully'),
            duration: 3000,
          });
          setDeleteId('');
        },
      });
    } else {
      showToast({
        type: 'error',
        title: t('you_are_using_free_version'),
        message: t('this_Feature_is_only_Available_in_Paid_Version'),
      });
      setDeleteId('');
    }
  };

  return (
    <div className="pt-5">
      <Table
        header={
          <RidersTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={data?.zonesPaginated?.data || []}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={ZONE_TABLE_COLUMNS({ menuItems })}
        totalRecords={data?.zonesPaginated?.totalCount ?? 0}
        currentPage={data?.zonesPaginated?.currentPage ?? currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={(page, rowCount) => {
          setCurrentPage(page);
          setRowsPerPage(rowCount);
        }}
      />
      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={() => {
          handleDeleteZone();
        }}
        message={t('Are you sure you want to delete this item?')}
      />
    </div>
  );
}
