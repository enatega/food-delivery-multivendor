//components
import DispatchHeader from '@/lib/ui/screen-components/protected/super-admin/dispatch/view/header/screen-header';
import DispatchMain from '@/lib/ui/screen-components/protected/super-admin/dispatch/view/main';

export default function DispatchScreen() {
  return (
    <div className="screen-container">
      <DispatchHeader />
      <DispatchMain />
    </div>
  );
}
