// Core
import { useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import {
  IQueryResult,
  IStaffGQLResponse,
  IStaffMainComponentsProps,
  IStaffResponse,
} from '@/lib/utils/interfaces';

// Components
import Table from '@/lib/ui/useable-components/table';
import { STAFF_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/staff-columns';
import StaffTableHeader from '../header/table-header';

// Utilities and Data
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';
import { generateDummyStaff } from '@/lib/utils/dummy';

// GraphQL
import { GET_STAFFS } from '@/lib/api/graphql/queries/staff';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import useToast from '@/lib/hooks/useToast';
import { useMutation } from '@apollo/client';
import { DELETE_STAFF } from '@/lib/api/graphql/mutations/staff';

export default function StaffMain({
  setIsAddStaffVisible,
  setStaff,
}: IStaffMainComponentsProps) {
  // Hooks
  const { showToast } = useToast();

  // States (Data Table)
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IStaffResponse[]>(
    []
  );
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const { data, loading } = useQueryGQL(GET_STAFFS, {
    fetchPolicy: 'cache-and-network',
  }) as IQueryResult<IStaffGQLResponse | undefined, undefined>;

  // For global search
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_STAFF,
    {
      refetchQueries: [{ query: GET_STAFFS }],
    }
  );

  const menuItems: IActionMenuItem<IStaffResponse>[] = [
    {
      label: 'Edit',
      command: (data?: IStaffResponse) => {
        if (data) {
          setIsAddStaffVisible(true);
          setStaff(data);
        }
      },
    },
    {
      label: 'Delete',
      command: (data?: IStaffResponse) => {
        if (data) {
          console.log(data);
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
        data={data?.staffs || (loading ? generateDummyStaff() : [])}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={STAFF_TABLE_COLUMNS({ menuItems })}
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
            onCompleted: (res) => {
              console.log('Delete Response:', res);
              showToast({
                type: 'success',
                title: 'Success!',
                message: 'Staff Deleted',
                duration: 3000,
              });
              setDeleteId('');
            },
            onError: (e) => {
              console.error('Delete Error:', e);
              showToast({
                type: 'error',
                title: 'Error!',
                message: 'Failed to delete staff.',
                duration: 3000,
              });
            },
          });
        }}
        message="Are you sure you want to delete this item?"
      />
    </div>
  );
}
