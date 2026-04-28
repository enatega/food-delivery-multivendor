"use client";
import dynamic from 'next/dynamic';

const DiscoveryScreen = dynamic(
  () => import('@/lib/ui/screens/protected/home').then(mod => mod.DiscoveryScreen),
  { ssr: false }
);  


export default function DisocveryPage() {
  return <DiscoveryScreen />;
}
