'use client';

import { FoodsProvider } from '@/lib/context/restaurant/foods.context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <FoodsProvider>{children}</FoodsProvider>;
}
