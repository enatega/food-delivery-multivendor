import DeliveryHeader from '@/lib/ui/screen-components/protected/restaurant/delivery/view/header';
import DeliveryMain from '@/lib/ui/screen-components/protected/restaurant/delivery/view/main';

export default function DeliveryScreen() {
  return (
    <div className="flex h-screen flex-col overflow-hidden p-3">
      <DeliveryHeader />
      <DeliveryMain />
    </div>
  );
}
