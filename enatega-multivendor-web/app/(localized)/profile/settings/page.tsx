"use client";
import dynamic from 'next/dynamic';

// Dynamically import the component with SSR disabled
const SettingsScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.SettingsScreen),
  { ssr: false }
);
// import { SettingsScreen } from "@/lib/ui/screens/protected/profile";

export default function SettingsPage() {
  return <SettingsScreen/>
}