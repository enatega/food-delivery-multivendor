import SettingsScreenHeader from '@/lib/ui/screen-components/protected/super-admin/settings/header';
import { VendorTypeConversionComponent } from '@/lib/ui/screen-components/protected/super-admin/settings/main';
import React from 'react';

export default function SettingsScreen() {
  return (
    <div className="screen-container">
      <SettingsScreenHeader />
      <VendorTypeConversionComponent />
    </div>
  );
}
