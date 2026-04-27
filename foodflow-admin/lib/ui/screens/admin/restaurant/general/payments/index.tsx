// Components
import PaymentMain from '@/lib/ui/screen-components/protected/restaurant/payment/main';
import PaymentHeader from '@/lib/ui/screen-components/protected/restaurant/payment/header/screen-header';

export default function PaymentScreen() {
  return (
    <div className="screen-container">
      <PaymentHeader />
      <PaymentMain />
    </div>
  );
}
