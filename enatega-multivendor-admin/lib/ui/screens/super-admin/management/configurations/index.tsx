import ConfigHeader from '@/lib/ui/screen-components/protected/super-admin/configuration/view/header';
import ConfigMain from '@/lib/ui/screen-components/protected/super-admin/configuration/view/main';
import NoData from '@/lib/ui/useable-components/no-data';
import { useConfiguration } from '@/lib/hooks/useConfiguration';

export default function ConfigurationsScreen() {
  const { ISPAID_VERSION } = useConfiguration();
  return (
    <div className="screen-container">
      <ConfigHeader />
      {ISPAID_VERSION ? (
        <ConfigMain />
      ) : (
          <NoData
            title="Payment Required"
            message="Please complete your purchase to gain full access to the product."
          />
      )}
    </div>
  );
}
