// Core
import { useContext, useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import {
  ICouponRestaurantGQLResponse,
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
import { generateDummyCouponsRestaurant } from '@/lib/utils/dummy';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';

// Context
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// GraphQL and Utilities
import { GET_RESTAURANT_COUPONS } from '@/lib/api/graphql/queries/coupons-restaurant';
import { DELETE_RESTAURANT_COUPON } from '@/lib/api/graphql/mutations/coupons-restaurant';
import { useMutation } from '@apollo/client';

export default function CouponsMain({
  setIsAddCouponVisible,
  setCoupon,
}: ICouponRestaurantMainComponentsProps) {
  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Hooks
  const { showToast } = useToast();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<
    ICouponRestaurantResponse[]
  >([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const { data, loading } = useQueryGQL(GET_RESTAURANT_COUPONS, {
    restaurantId: restaurantId,
  }) as IQueryResult<ICouponRestaurantGQLResponse | undefined, undefined>;

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_RESTAURANT_COUPON,
    {
      refetchQueries: [
        { query: GET_RESTAURANT_COUPONS, variables: { restaurantId } },
      ],
    }
  );

  // For global search
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const menuItems: IActionMenuItem<ICouponRestaurantResponse>[] = [
    {
      label: 'Edit',
      command: (data?: ICouponRestaurantResponse) => {
        if (data) {
          setIsAddCouponVisible(true);
          setCoupon(data);
        }
      },
    },
    {
      label: 'Delete',
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
        data={
          data?.restaurantCoupons ||
          (loading ? generateDummyCouponsRestaurant() : [])
        }
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={COUPONS_RESTAURANT_TABLE_COLUMNS({ menuItems })}
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
                title: 'Success!',
                message: 'Coupon Deleted',
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
