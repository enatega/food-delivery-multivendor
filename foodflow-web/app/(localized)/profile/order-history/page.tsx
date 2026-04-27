"use client";

import dynamic from 'next/dynamic';

// Dynamically import the component with SSR disabled
const OrderHistoryScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.OrderHistoryScreen),
  { ssr: false }
);
// import { OrderHistoryScreen } from "@/lib/ui/screens/protected/profile";

export default function OrderHistoryPage() {
  return <OrderHistoryScreen/>
}
