// orders.vendor.row.skeleton.ts
import React from 'react';
import { Skeleton } from 'primereact/skeleton';

interface OrderTableSkeletonProps {
  rowCount: number;
}

const createSkeletonRow = () => ({
  orderId: <Skeleton width="100%" height="1.5rem" />,
  itemsTitle: <Skeleton width="100%" height="1.5rem" />,
  paymentMethod: <Skeleton width="100%" height="1.5rem" />,
  orderStatus: <Skeleton width="100%" height="1.5rem" />,
  DateCreated: <Skeleton width="100%" height="1.5rem" />,
  OrderdeliveryAddress: <Skeleton width="100%" height="1.5rem" />,
});

const OrderTableSkeleton = ({ rowCount }: OrderTableSkeletonProps) => 
  Array(rowCount).fill(null).map(() => createSkeletonRow());

export default OrderTableSkeleton;