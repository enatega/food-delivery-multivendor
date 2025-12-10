'use client';

import { LoyaltyProvider } from '@/lib/context/super-admin/loyalty-referral.context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LoyaltyProvider>{children}</LoyaltyProvider>;
}
