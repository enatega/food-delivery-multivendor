'use client';

import { RestaurantProvider } from '@/lib/context/super-admin/restaurant.context';
import { VendorProvider } from '@/lib/context/super-admin/vendor.context';
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

  // Handlers
  const onInit = () => {
    if (IS_FETCHING_CONFIGURATION) return;
    if (IS_MULTIVENDOR === null || IS_MULTIVENDOR === undefined) return;
    if (IS_MULTIVENDOR === true) return;

    router.replace('/404');
  };

  useEffect(() => {
    onInit();
  }, [IS_MULTIVENDOR, IS_FETCHING_CONFIGURATION]);

  return IS_FETCHING_CONFIGURATION || !IS_MULTIVENDOR ? (
    <></>
  ) : (
    <VendorProvider>
      <RestaurantProvider>{children}</RestaurantProvider>
    </VendorProvider>
  );
}
