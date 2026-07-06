// Core
import { useContext, useEffect, useState } from 'react';

// Interface and Types
import {
  ICouponRestaurantPaginatedGQLResponse,
  ICouponRestaurantMainComponentsProps,
  ICouponRestaurantResponse,
} from '@/lib/utils/interfaces/coupons-restaurant.interface';
import { IQueryResult } from '@/lib/utils/interfaces';

// UI Components
import CouponsTableHeader from '../header/table-header';
import { COUPONS_RESTAURANT_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/coupons-restaurant-columns';
import DeleteDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';

// Utilities and Data
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import useDebounce from '@/lib/hooks/useDebounce';

// Context
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// GraphQL and Utilities
import { GET_RESTAURANT_COUPONS_PAGINATED } from '@/lib/api/graphql/queries/coupons-restaurant';
import { DELETE_RESTAURANT_COUPON } from '@/lib/api/graphql/mutations/coupons-restaurant';
import { useMutation } from '@apollo/client';
import { useTranslations } from 'next-intl';

export default function CouponsMain({
  setIsAddCouponVisible,
  setCoupon,
}: ICouponRestaurantMainComponentsProps) {
  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<
    ICouponRestaurantResponse[]
  >([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(globalFilterValue, 500);

  // Query
  const { data, loading } = useQueryGQL(GET_RESTAURANT_COUPONS_PAGINATED, {
    restaurantId,
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
  }, {
    fetchPolicy: 'network-only',
  }) as IQueryResult<
    ICouponRestaurantPaginatedGQLResponse | undefined,
    undefined
  >;

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_RESTAURANT_COUPON,
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

  const menuItems: IActionMenuItem<ICouponRestaurantResponse>[] = [
    {
      label: t('Edit'),
      command: (data?: ICouponRestaurantResponse) => {
        if (data) {
          setIsAddCouponVisible(true);
          setCoupon(data);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: ICouponRestaurantResponse) => {
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
          <CouponsTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={data?.restaurantCouponsPaginated?.data || []}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={COUPONS_RESTAURANT_TABLE_COLUMNS({ menuItems })}
        totalRecords={data?.restaurantCouponsPaginated?.totalCount ?? 0}
        currentPage={
          data?.restaurantCouponsPaginated?.currentPage ?? currentPage
        }
        rowsPerPage={rowsPerPage}
        onPageChange={(page, rowCount) => {
          setCurrentPage(page);
          setRowsPerPage(rowCount);
        }}
      />
      <DeleteDialog
        loading={mutationLoading}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={() => {
          mutateDelete({
            variables: { restaurantId, couponId: deleteId },
            onCompleted: () => {
              showToast({
                type: 'success',
                title: t('Success'),
                message: t('Coupon Deleted'),
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
