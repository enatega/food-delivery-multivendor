import React, { useState, useMemo, useContext } from 'react';
import Table from '@/lib/ui/useable-components/table';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import OrderTableHeader from '../header/table-header';
import { IQueryResult } from '@/lib/utils/interfaces';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { GET_ORDER_BY_RESTAURANT_WITHOUT_PAGINATION } from '@/lib/api/graphql';
import { ORDER_COLUMNS } from '@/lib/ui/useable-components/table/columns/order-vendor-columns';
import OrderTableSkeleton from '@/lib/ui/useable-components/custom-skeletons/orders.vendor.row.skeleton';
import { IOrder, IOrdersData, IExtendedOrder } from '@/lib/utils/interfaces';
import { TOrderRowData } from '@/lib/utils/types';
import { DataTableRowClickEvent } from 'primereact/datatable';
import OrderDetailModal from '@/lib/ui/useable-components/popup-menu/order-details-modal';

export default function OrderVendorMain() {
  const [selectedData, setSelectedData] = useState<IExtendedOrder[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<IExtendedOrder | null>(null);
  // Remove page and rows state
  // const [page, setPage] = useState(0);
  // const [rows, setRows] = useState(10);

  const { data, error, loading } = useQueryGQL(
    GET_ORDER_BY_RESTAURANT_WITHOUT_PAGINATION,
    {
      restaurant: restaurantId,
      search: searchTerm, // Only pass restaurant and search
    },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
    }
  ) as IQueryResult<IOrdersData | undefined, undefined>;

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleRowClick = (event: DataTableRowClickEvent) => {
    const selectedOrder = event.data as IExtendedOrder;
    setSelectedRestaurant(selectedOrder);
    setIsModalOpen(true);
  };



  const tableData = useMemo(() => {
    if (!data?.ordersByRestIdWithoutPagination) return [];

    return data.ordersByRestIdWithoutPagination.map(
      (order: IOrder): IExtendedOrder => ({
        ...order,
        itemsTitle:
          order.items
            .map((item) => item.title)
            .join(', ')
            .slice(0, 15) + '...',
        OrderdeliveryAddress:
          order.deliveryAddress.deliveryAddress.toString().slice(0, 15) + '...',
        DateCreated: order.createdAt.toString().slice(0, 10),
      })
    );
  }, [data]);

  const filteredData = useMemo(() => {
    return tableData.filter((order: IExtendedOrder) => {
      const statusFilter =
        selectedActions.length === 0 ||
        selectedActions.includes(order.orderStatus);
      return statusFilter;
    });
  }, [tableData, selectedActions, searchTerm]);

  const displayData: TOrderRowData[] = useMemo(() => {
    if (loading) {
      return OrderTableSkeleton({ rowCount: 10 }); // Change as per your need, no rows state now
    }
    return filteredData;
  }, [loading, filteredData]);

  if (!restaurantId) {
    return null;
  }

  return (
    <div className="p-3">
      <OrderTableHeader
        selectedActions={selectedActions}
        setSelectedActions={setSelectedActions}
        onSearch={handleSearch}
      />
      <Table
        data={displayData as IExtendedOrder[]}
        setSelectedData={setSelectedData}
        selectedData={selectedData}
        columns={ORDER_COLUMNS}
        loading={loading}
        handleRowClick={handleRowClick}
        moduleName = 'Restaurant-Order'
      />
      <OrderDetailModal
        visible={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        restaurantData={selectedRestaurant}
      />
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </div>
  );
}
