"use client";
import React, { useState } from 'react';
import Table from '@/lib/ui/useable-components/table';
import { ORDER_SUPER_ADMIN_COLUMNS } from '@/lib/ui/useable-components/table/columns/order-superadmin-columns';
import OrderDetailModal from '@/lib/ui/useable-components/popup-menu/order-details-modal'; // Import the shared modal component
import { IExtendedOrder } from '@/lib/utils/interfaces'; // Import IExtendedOrder
import { DataTableRowClickEvent } from 'primereact/datatable';

interface OrderHistoryProps {
  orders: IExtendedOrder[];
  totalRecords: number;
  rowsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, totalRecords, rowsPerPage, currentPage, onPageChange, onLimitChange }) => {


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IExtendedOrder | null>(null); // Use IExtendedOrder

  const handleRowClick = (event: DataTableRowClickEvent) => {
    setSelectedOrder(event.data as IExtendedOrder);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div className="">
      <Table
        data={orders}
        columns={ORDER_SUPER_ADMIN_COLUMNS()}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        currentPage={currentPage}
        onPageChange={(page, limit) => {
          onPageChange(page);
          onLimitChange(limit);
        }}
        handleRowClick={handleRowClick}
      />
      <OrderDetailModal visible={isModalVisible} onHide={hideModal} restaurantData={selectedOrder} />
    </div>
  );
};

export default OrderHistory;