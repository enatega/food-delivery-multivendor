'use client';

// HOC
import VENDOR_GUARD from '@/lib/hoc/VENDOR_GUARD';
// CONTEXT
import { VendorLayoutProvider } from '@/lib/context/vendor/layout-vendor.context';
import VendorLayout from '@/lib/ui/layouts/protected/vendor';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { IS_MULTIVENDOR, IS_FETCHING_CONFIGURATION } = useConfiguration();
  const router = useRouter();

  const ProtectedLayout = VENDOR_GUARD(
    ({ children }: { children: React.ReactNode }) => {
      return <VendorLayout>{children}</VendorLayout>;
    }
  );

  // Handlers
  const onInit = () => {
    if (IS_FETCHING_CONFIGURATION) return;
    if (IS_MULTIVENDOR === null || IS_MULTIVENDOR === undefined) return;
    if (IS_MULTIVENDOR === true) return;

    router.replace('/404');
  };

  // Effects
  useEffect(() => {
    onInit();
  }, [IS_MULTIVENDOR, IS_FETCHING_CONFIGURATION]);

  return IS_FETCHING_CONFIGURATION || !IS_MULTIVENDOR ? (
    <></>
  ) : (
    <VendorLayoutProvider>
      {/* VendorLayoutProvider for context */}
      <ProtectedLayout>{children}</ProtectedLayout> {/* UI Layout for Vendor */}
    </VendorLayoutProvider>
  );
}
