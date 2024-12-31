'use client';

import { RestaurantProvider } from '@/lib/context/super-admin/restaurant.context';
import { VendorProvider } from '@/lib/context/super-admin/vendor.context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <VendorProvider>
      <RestaurantProvider>{children}</RestaurantProvider>
    </VendorProvider>
  );
}
