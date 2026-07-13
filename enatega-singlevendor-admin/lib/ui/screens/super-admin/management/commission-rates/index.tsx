// Components
import CommissionRateMain from '@/lib/ui/screen-components/protected/super-admin/commission-rate/view/main';
import CommissionRateHeader from '@/lib/ui/screen-components/protected/super-admin/commission-rate/view/header/screen-header';

export default function CommissionRateScreen() {
  return (
    <div className="screen-container">
      <CommissionRateHeader />
      <CommissionRateMain />
    </div>
  );
}
