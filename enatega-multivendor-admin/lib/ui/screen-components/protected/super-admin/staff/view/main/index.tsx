// Core
import { useEffect, useState } from 'react';

// Interface and Types
import {
  IQueryResult,
  IStaffPaginatedGQLResponse,
  IStaffMainComponentsProps,
  IStaffResponse,
} from '@/lib/utils/interfaces';

// Components
import Table from '@/lib/ui/useable-components/table';
import { STAFF_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/staff-columns';
import StaffTableHeader from '../header/table-header';
import useDebounce from '@/lib/hooks/useDebounce';

// Utilities and Data
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';

// GraphQL
import { GET_STAFFS_PAGINATED } from '@/lib/api/graphql/queries/staff';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import useToast from '@/lib/hooks/useToast';
import { useMutation } from '@apollo/client';
import { DELETE_STAFF } from '@/lib/api/graphql/mutations/staff';
import { useTranslations } from 'next-intl';

export default function StaffMain({
  setIsAddStaffVisible,
  setStaff,
}: IStaffMainComponentsProps) {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // States (Data Table)
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IStaffResponse[]>(
    []
  );
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(globalFilterValue, 500);

  // Query
  const { data, loading } = useQueryGQL(GET_STAFFS_PAGINATED, {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
  }, {
    fetchPolicy: 'network-only',
  }) as IQueryResult<IStaffPaginatedGQLResponse | undefined, undefined>;

  // For global search
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_STAFF,
    {
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    }
  );

  const menuItems: IActionMenuItem<IStaffResponse>[] = [
    {
      label: t('Edit'),
      command: (data?: IStaffResponse) => {
        if (data) {
          setIsAddStaffVisible(true);
          setStaff(data);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IStaffResponse) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

  return (
    <div className="p-3">
      <Table
        header={
          <StaffTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={data?.staffsPaginated?.data || []}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={STAFF_TABLE_COLUMNS({ menuItems })}
        totalRecords={data?.staffsPaginated?.totalCount ?? 0}
        currentPage={data?.staffsPaginated?.currentPage ?? currentPage}
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
          mutateDelete({
            variables: { id: deleteId },
            onCompleted: () => {
              showToast({
                type: 'success',
                title: t('Success'),
                message: t('Staff Deleted'),
                duration: 3000,
              });
              setDeleteId('');
            },
            onError: () => {
              showToast({
                type: 'error',
                title: t('Error'),
                message: t('Failed to delete staff'),
                duration: 3000,
              });
            },
          });
        }}
        message={t('Are you sure you want to delete this item?')}
      />
    </div>
  );
}
