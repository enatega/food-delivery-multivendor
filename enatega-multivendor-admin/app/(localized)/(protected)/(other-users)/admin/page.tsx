'use client';

// Core
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  // Hooks
  const router = useRouter();

  // Effects
  useEffect(() => {
    // If userType vendor -> redirect to vendor dashboard else restaurant dashboard
    router.push('/admin/store/dashboard');
  }, []);

  return <></>;
}
