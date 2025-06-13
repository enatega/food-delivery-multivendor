"use client";

import dynamic from 'next/dynamic';

// Dynamically import the component with SSR disabled
const CustomerTicketsScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.CustomerTicketsScreen),
  { ssr: false }
);

export default function CustomerTicketsPage() {
  return <CustomerTicketsScreen/>
}