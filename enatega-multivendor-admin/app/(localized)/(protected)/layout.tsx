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

  // Always render GoogleMapsProvider so the component tree is stable.
  // Conditionally mounting it based on GOOGLE_MAPS_KEY causes a full subtree
  // remount when config loads, which makes navigation "go back" on first click.
  // GoogleMapsProvider handles an empty key gracefully: isLoaded stays true
  // until a real key arrives, then flips false while the script loads.
  return (
    <GoogleMapsProvider apiKey={GOOGLE_MAPS_KEY || ''} libraries={LIBRARIES}>
      <GlobalLayout>{children}</GlobalLayout>
    </GoogleMapsProvider>
  );
}
