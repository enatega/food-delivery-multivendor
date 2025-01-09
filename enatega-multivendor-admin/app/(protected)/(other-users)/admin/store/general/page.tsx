'use client';

// Core
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GeneralPage() {
  // Hooks
  const router = useRouter();

  // Effects
  useEffect(() => {
    router.push('/admin/store/general/timing');
  }, []);

  return <></>;
}
