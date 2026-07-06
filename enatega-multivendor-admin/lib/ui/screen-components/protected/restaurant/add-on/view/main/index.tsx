// Core
import { useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';

// Interface and Types
import {
  IActionMenuItem,
  IAddon,
  IAddonPaginatedByRestaurantResponse,
  IAddonMainComponentsProps,
  IQueryResult,
} from '@/lib/utils/interfaces';

// Components
import Table from '@/lib/ui/useable-components/table';
import { ADDON_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/addon-columns';
import CategoryTableHeader from '../header/table-header';

// Utilities and Data
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';

// Context
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import useDebounce from '@/lib/hooks/useDebounce';

// GraphQL
import { DELETE_ADDON, GET_OPTIONS_BY_RESTAURANT_ID } from '@/lib/api/graphql';
import { GET_RESTAURANT_ADDONS_PAGINATED } from '@/lib/api/graphql/queries/addon';

// Context
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useTranslations } from 'next-intl';

export default function OptionMain({
  setIsAddAddonVisible,
  setAddon,
}: IAddonMainComponentsProps) {
  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IAddon[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(globalFilterValue, 500);

  // Query
  const { data, loading } = useQueryGQL(
    GET_RESTAURANT_ADDONS_PAGINATED,
    {
      restaurantId,
      page: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch || undefined,
    },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onCompleted: onFetchAddonsByRestaurantCompleted,
      onError: onErrorFetchAddonsByRestaurant,
    }
  ) as IQueryResult<
    IAddonPaginatedByRestaurantResponse | undefined,
    undefined
  >;

  //Mutation
  const [deleteCategory, { loading: mutationLoading }] = useMutation(
    DELETE_ADDON,
    {
      variables: {
        id: deleteId,
        restaurant: restaurantId,
      },
      refetchQueries: [
        {
          query: GET_OPTIONS_BY_RESTAURANT_ID,
          variables: { id: restaurantId },
        },
      ],
    }
  );

  // Handlers
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Restaurant Profile Complete
  function onFetchAddonsByRestaurantCompleted() {}
  // Restaurant Zone Info Error
  function onErrorFetchAddonsByRestaurant() {
    showToast({
      type: 'error',
      title: t('Addons Fetch'),
      message: t('Addons fetch failed'),
      duration: 2500,
    });
  }

  // Constants
  const menuItems: IActionMenuItem<IAddon>[] = [
    {
      label: t('Edit'),
      command: (data?: IAddon) => {
        if (data) {
          setIsAddAddonVisible(true);

          setAddon(data);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IAddon) => {
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
          <CategoryTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={data?.restaurantAddonsPaginated?.data || []}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={ADDON_TABLE_COLUMNS({ menuItems })}
        totalRecords={data?.restaurantAddonsPaginated?.totalCount ?? 0}
        currentPage={
          data?.restaurantAddonsPaginated?.currentPage ?? currentPage
        }
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
        onConfirm={async () => {
          await deleteCategory({
            variables: { id: deleteId },
            onCompleted: () => {
              showToast({
                type: 'success',
                title: t('Delete Add-on'),
                message: t('Add-on has been deleted successfully'),
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message={t('Are you sure you want to delete this Add-on?')}
      />
    </div>
  );
}
