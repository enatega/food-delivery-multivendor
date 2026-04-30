"use client";

import dynamic from 'next/dynamic';

// Dynamically import the component with SSR disabled
const GetHelpScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.GetHelpScreen),
  { ssr: false }
);

export default function GetHelpPage() {
  return <GetHelpScreen/>
}