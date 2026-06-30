// Core
import { useContext, useEffect, useState } from 'react';

// Interface and Types

// Components
import Table from '@/lib/ui/useable-components/table';
import { OPTION_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/option-columns';

// Utilities and Data
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';

//Toast
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import useDebounce from '@/lib/hooks/useDebounce';
import {
  IOptions,
  IOptionsPaginatedByRestaurantResponse,
  IOptionsMainComponentsProps,
  IQueryResult,
} from '@/lib/utils/interfaces';

// GraphQL
import { DELETE_OPTION, GET_OPTIONS_BY_RESTAURANT_ID } from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useMutation } from '@apollo/client';
import CategoryTableHeader from '../header/table-header';
import { useTranslations } from 'next-intl';
import { GET_RESTAURANT_OPTIONS_PAGINATED } from '@/lib/api/graphql/queries/options';

export default function OptionMain({
  setIsAddOptionsVisible,
  setOption,
}: IOptionsMainComponentsProps) {
  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IOptions[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(globalFilterValue, 500);

  // Query
  const { data, loading } = useQueryGQL(
    GET_RESTAURANT_OPTIONS_PAGINATED,
    {
      restaurantId,
      page: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch || undefined,
    },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onCompleted: onFetchCategoriesByRestaurantCompleted,
      onError: onErrorFetchCategoriesByRestaurant,
    }
  ) as IQueryResult<
    IOptionsPaginatedByRestaurantResponse | undefined,
    undefined
  >;

  //Mutation
  const [deleteCategory, { loading: mutationLoading }] = useMutation(
    DELETE_OPTION,
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

  // Complete and Error
  function onFetchCategoriesByRestaurantCompleted() {}
  function onErrorFetchCategoriesByRestaurant() {
    showToast({
      type: 'error',
      title: t('Option Fetch'),
      message: t('Categories fetch failed'),
      duration: 2500,
    });
  }

  // Constants
  const menuItems: IActionMenuItem<IOptions>[] = [
    {
      label: t('Edit'),
      command: (data?: IOptions) => {
        if (data) {
          setIsAddOptionsVisible(true);
          setOption(data);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IOptions) => {
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
        data={data?.restaurantOptionsPaginated?.data || []}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={OPTION_TABLE_COLUMNS({ menuItems })}
        totalRecords={data?.restaurantOptionsPaginated?.totalCount ?? 0}
        currentPage={
          data?.restaurantOptionsPaginated?.currentPage ?? currentPage
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
        onConfirm={() => {
          deleteCategory({
            variables: { id: deleteId },
            onCompleted: () => {
              showToast({
                type: 'success',
                title: t('Delete Option'),
                message: t('Option has been deleted successfully'),
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message={t('Are you sure you want to delete this option?')}
      />
    </div>
  );
}
