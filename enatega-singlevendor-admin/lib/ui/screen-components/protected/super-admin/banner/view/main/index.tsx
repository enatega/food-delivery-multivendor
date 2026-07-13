// Core
import { useEffect, useState } from 'react';

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
} from '@/lib/utils/interfaces';

// GraphQL
import { DELETE_BANNER } from '@/lib/api/graphql';
import { GET_BANNERS } from '@/lib/api/graphql/queries/banners';
import { generateDummyBanners } from '@/lib/utils/dummy';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslations } from 'next-intl';

export default function BannersMain({
  setIsAddBannerVisible,
  setBanner,
}: IBannersMainComponentsProps) {
  // Hooks
  const { showToast } = useToast();
  const t = useTranslations();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IBannersResponse[]>(
    []
  );
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);

  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    action: {
      value: selectedActions.length > 0 ? selectedActions : null,
      matchMode: FilterMatchMode.IN,
    },
  };

  //Query
  const {
    data,
    loading,
    refetch: refetchBanners,
  } = useQuery<
    IBannersDataResponse,
    { page: number; rowsPerPage: number; search: string }
  >(GET_BANNERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      page: currentPage,
      rowsPerPage: pageSize,
      search: '',
    },
  });

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_BANNER,
    {
      refetchQueries: [
        {
          query: GET_BANNERS,
        },
      ],
    }
  );

  const menuItems: IActionMenuItem<IBannersResponse>[] = [
    {
      label: t('Edit'),
      command: (data?: IBannersResponse) => {
        if (data) {
          setIsAddBannerVisible(true);
          setBanner(data);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IBannersResponse) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

  // Handlers
  // const onPageChange = (page: number, size: number) => {
  //   setCurrentPage(page);
  //   setPageSize(size);
  // };

  // UseEffects
  useEffect(() => {
    refetchBanners({
      page: currentPage,
      rowsPerPage: pageSize,
      search: '',
    });
  }, [currentPage]);
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
                title: t('Success'),
                message: t(`Banner Deleted`),
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message={t('Are you sure you want to delete this item?')}
      />
    </div>
  );
}
