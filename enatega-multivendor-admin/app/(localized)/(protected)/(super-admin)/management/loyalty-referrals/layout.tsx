'use client';

import { GoogleMapsProvider } from '@/lib/context/global/google-maps.context';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
// Layout
import GlobalLayout from '@/lib/ui/layouts/protected/global';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { GOOGLE_MAPS_KEY, LIBRARIES } = useConfiguration();

  return GOOGLE_MAPS_KEY ? (
    <GoogleMapsProvider apiKey={GOOGLE_MAPS_KEY} libraries={LIBRARIES}>
      <GlobalLayout>{children}</GlobalLayout>
    </GoogleMapsProvider>
  ) : (
    <GlobalLayout>{children}</GlobalLayout>
  );
}
