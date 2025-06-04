"use client";
import dynamic from 'next/dynamic';

const StoreScreen = dynamic(
  () => import('@/lib/ui/screens/protected/home').then(mod => mod.StoreScreen),
  { ssr: false }
);

export default function StorePage() {
  return <StoreScreen/>;
}
