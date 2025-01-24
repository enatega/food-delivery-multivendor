'use client';

import { ProfileProvider as DataProvider } from '@/lib/context/restaurant/profile.context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DataProvider>{children}</DataProvider>;
}
