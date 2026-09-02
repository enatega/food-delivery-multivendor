import OrdersVendorHeader from '@/lib/ui/screen-components/protected/vendor/order/header/screen-header';
import OrderVendorMain from '@/lib/ui/screen-components/protected/vendor/order/main';

const OrderVendorScreen = () => {
  return (
    <div className="screen-container">
      <OrdersVendorHeader />
      <OrderVendorMain />
    </div>
  );
};

export default OrderVendorScreen;
