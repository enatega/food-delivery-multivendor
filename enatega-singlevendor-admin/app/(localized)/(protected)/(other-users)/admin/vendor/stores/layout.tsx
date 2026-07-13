'use client';

import { VendorLayoutRestaurantProvider } from '@/lib/context/vendor/restaurant.context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <VendorLayoutRestaurantProvider>{children}</VendorLayoutRestaurantProvider>
  );
}
