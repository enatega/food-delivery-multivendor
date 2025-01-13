import ConfigHeader from '@/lib/ui/screen-components/protected/super-admin/configuration/view/header';
import ConfigMain from '@/lib/ui/screen-components/protected/super-admin/configuration/view/main';

export default function ConfigurationsScreen() {
  return (
    <div className="screen-container">
      <ConfigHeader />
      <ConfigMain />
    </div>
  );
}
