import { IExtendedOrder } from "@/lib/utils/interfaces";
export const ORDER_COLUMNS = [
  {
    headerName: 'Order ID',
    propertyName: 'orderId',
  },
  {
    propertyName: 'itemsTitle',
    headerName: 'Items',
  },
  {
    headerName: 'Payment',
    propertyName: 'paymentMethod',
  },
  {
    headerName: 'Order Status',
    propertyName: 'orderStatus',
  },
  {
    headerName: 'Created At',
    propertyName: 'DateCreated',
    body:(rowData:IExtendedOrder)=>{
      const formatedDate = new Date(Number(rowData?.DateCreated)).toDateString();
      return(
        <span>
          {formatedDate}
        </span>
      )
    }
  },
  {
    headerName: 'Delivery Address',
    propertyName: 'OrderdeliveryAddress',
  },
];
