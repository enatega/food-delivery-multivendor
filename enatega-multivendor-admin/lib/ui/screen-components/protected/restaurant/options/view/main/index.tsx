// Core
import { useContext, useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

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
import {
  IOptions,
  IOptionsByRestaurantResponse,
  IOptionsMainComponentsProps,
  IQueryResult,
} from '@/lib/utils/interfaces';

// GraphQL
import { DELETE_OPTION, GET_OPTIONS_BY_RESTAURANT_ID } from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useMutation } from '@apollo/client';
import CategoryTableHeader from '../header/table-header';
import { useTranslations } from 'next-intl';

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
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const { data, loading } = useQueryGQL(
    GET_OPTIONS_BY_RESTAURANT_ID,
    { id: restaurantId },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onCompleted: onFetchCategoriesByRestaurantCompleted,
      onError: onErrorFetchCategoriesByRestaurant,
    }
  ) as IQueryResult<IOptionsByRestaurantResponse | undefined, undefined>;

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
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

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
        data={
          (data?.restaurant?.options || [])
            .filter(option => option.title !== '7up' && option.title !== 'Pepsi') // Filter out default options cpming from the backend
            .slice()
            .reverse()|| []
        }
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={OPTION_TABLE_COLUMNS({ menuItems })}
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
