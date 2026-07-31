'use client';

import { RestaurantsProvider } from '@/lib/context/super-admin/restaurants.context';
import { GoogleMapsLoader } from '@/lib/ui/useable-components/google-maps/maps-loader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleMapsLoader>
      <RestaurantsProvider>{children}</RestaurantsProvider>
    </GoogleMapsLoader>
  );
}
