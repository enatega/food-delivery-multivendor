"use client";
import dynamic from 'next/dynamic';

const RestaurantsScreen = dynamic(
  () => import('@/lib/ui/screens/protected/home').then(mod => mod.RestaurantsScreen),
  { ssr: false }
);

export default function RestaurantPage() {
  return <RestaurantsScreen />;
}
