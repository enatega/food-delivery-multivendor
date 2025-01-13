// Core
import { useState } from 'react';

// PrimeReact
import { FilterMatchMode } from 'primereact/api';

// Hooks
import useToast from '@/lib/hooks/useToast';

// Custom Components
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import { BANNERS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/banners-columns';
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';
import BannerTableHeader from '../header/table-header';

// Interfaces and Types
import {
  IBannersDataResponse,
  IBannersMainComponentsProps,
  IBannersResponse,
  IQueryResult,
} from '@/lib/utils/interfaces';

// GraphQL
import { DELETE_BANNER } from '@/lib/api/graphql';
import { GET_BANNERS } from '@/lib/api/graphql/queries/banners';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { generateDummyBanners } from '@/lib/utils/dummy';
import { useMutation } from '@apollo/client';

export default function BannersMain({
  setIsAddBannerVisible,
  setBanner,
}: IBannersMainComponentsProps) {
  // Hooks
  const { showToast } = useToast();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IBannersResponse[]>(
    []
  );
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    action: {
      value: selectedActions.length > 0 ? selectedActions : null,
      matchMode: FilterMatchMode.IN,
    },
  };

  //Query
  const { data, loading } = useQueryGQL(GET_BANNERS, {
    fetchPolicy: 'cache-and-network',
  }) as IQueryResult<IBannersDataResponse | undefined, undefined>;

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_BANNER,
    {
      refetchQueries: [{ query: GET_BANNERS }],
    }
  );

  const menuItems: IActionMenuItem<IBannersResponse>[] = [
    {
      label: 'Edit',
      command: (data?: IBannersResponse) => {
        if (data) {
          setIsAddBannerVisible(true);
          setBanner(data);
        }
      },
    },
    {
      label: 'Delete',
      command: (data?: IBannersResponse) => {
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
          <BannerTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        data={data?.banners || (loading ? generateDummyBanners() : [])}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        columns={BANNERS_TABLE_COLUMNS({ menuItems })}
        loading={loading}
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
                title: 'Success!',
                message: 'Banner Deleted',
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message="Are you sure you want to delete this item?"
      />
    </div>
  );
}
