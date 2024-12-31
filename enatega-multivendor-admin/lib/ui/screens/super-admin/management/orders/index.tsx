import OrdersSuperAdminHeader from "@/lib/ui/screen-components/protected/super-admin/order/header/screen-header";
import OrderSuperAdminMain from "@/lib/ui/screen-components/protected/super-admin/order/main";
const OrderSuperAdminScreen = () => {
  return (
    <div className="screen-container">
      <OrdersSuperAdminHeader />
      <OrderSuperAdminMain />
    </div>
  );
};

export default OrderSuperAdminScreen;