'use client';

import { RestaurantsProvider } from '@/lib/context/super-admin/restaurants.context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RestaurantsProvider>{children}</RestaurantsProvider>
  );
}
