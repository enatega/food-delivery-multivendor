import React, { useState, useMemo } from 'react';
import Table from '@/lib/ui/useable-components/table';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { IDateFilter, IQueryResult } from '@/lib/utils/interfaces';
import OrderTableSkeleton from '@/lib/ui/useable-components/custom-skeletons/orders.vendor.row.skeleton';
import { IOrder, IExtendedOrder } from '@/lib/utils/interfaces';
import { TOrderRowData } from '@/lib/utils/types';
import { GET_ORDERS_WITHOUT_PAGINATION } from '@/lib/api/graphql';
import OrderSuperAdminTableHeader from '../header/table-header';
import { ORDER_SUPER_ADMIN_COLUMNS } from '@/lib/ui/useable-components/table/columns/order-superadmin-columns';
import { DataTableRowClickEvent } from 'primereact/datatable';
import OrderDetailModal from '@/lib/ui/useable-components/popup-menu/order-details-modal';
import { FilterMatchMode } from 'primereact/api';
import DashboardDateFilter from '@/lib/ui/useable-components/date-filter';

export default function OrderSuperAdminMain() {
  const [selectedData, setSelectedData] = useState<IExtendedOrder[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<IExtendedOrder | null>(null);
  const [dateFilter, setDateFilter] = useState<IDateFilter>({
    dateKeyword: 'All',
    startDate: `${new Date().getFullYear()}-01-01`, // Current year, January 1st
    endDate: `${new Date().getFullYear()}-${String(new Date().getMonth()).padStart(2, '0')}-${String(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()).padStart(2, '0')}`, // Last day of previous month
  });

  const handleDateFilter = (dateFilter: IDateFilter) => {
    setDateFilter({
      dateKeyword: dateFilter.dateKeyword ?? '',
      endDate: dateFilter.endDate ?? new Date().getDate(),
      startDate: dateFilter.startDate ?? new Date().getDate(),
    });
  };

  const { data, error, loading } = useQueryGQL(
    GET_ORDERS_WITHOUT_PAGINATION,
    {
      dateKeyword: dateFilter.dateKeyword,
      starting_date: dateFilter?.startDate,
      ending_date: dateFilter?.endDate,
    },
    {
      fetchPolicy: 'network-only',
    }
  ) as IQueryResult<
    { allOrdersWithoutPagination: IOrder[] } | undefined,
    undefined
  >;

  console.log(data);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: {
      value: '' as string | null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  // For global search
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleRowClick = (event: DataTableRowClickEvent) => {
    const selectedOrder = event.data as IExtendedOrder;
    setSelectedRestaurant(selectedOrder);
    setIsModalOpen(true);
  };

  const tableData = useMemo(() => {
    if (!data?.allOrdersWithoutPagination) return [];

    return data.allOrdersWithoutPagination.map(
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
      return OrderTableSkeleton({ rowCount: 10 }); // Display 10 skeleton rows while loading
    }
    return filteredData;
  }, [loading, filteredData]);

  return (
    <div className="p-3 screen-container">
      <Table
        header={
          <>
            <OrderSuperAdminTableHeader
              globalFilterValue={globalFilterValue}
              onGlobalFilterChange={onGlobalFilterChange}
              selectedActions={selectedActions}
              setSelectedActions={setSelectedActions}
              onSearch={handleSearch}
              dateFilter={dateFilter}
              handleDateFilter={handleDateFilter}
            />
            <DashboardDateFilter
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          </>
        }
        data={displayData as IExtendedOrder[]}
        setSelectedData={setSelectedData}
        selectedData={selectedData}
        columns={ORDER_SUPER_ADMIN_COLUMNS}
        loading={loading}
        filters={filters}
        handleRowClick={handleRowClick}
        moduleName="SuperAdmin-Order"
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
