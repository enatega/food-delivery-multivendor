"use client";
import dynamic from 'next/dynamic';

// Dynamically import the component with SSR disabled
const PersonalInfoScreen = dynamic(
  () => import('@/lib/ui/screens/protected/profile').then(mod => mod.PersonalInfoScreen),
  { ssr: false }
);

// import { PersonalInfoScreen } from "@/lib/ui/screens/protected/profile";

export default function PersonalInfo() {
  return (
    <PersonalInfoScreen/>
  )
}
