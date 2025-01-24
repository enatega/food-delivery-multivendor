'use client';

// Core
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// Screen

export default function GeneralPage() {
  // Hooks
  const router = useRouter();

  // Effects
  useEffect(() => {
    router.push('/management/configurations');
  }, []);

  return <></>;
}
