'use client';

// Core
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Methods
import { getAccessToken } from '@/lib/utils/methods/auth';
import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';

export default function RootPage() {
  // Hooks
  const router = useRouter();

  useEffect(() => {
    router.replace(getAccessToken() ? '/home' : '/authentication/login');
  }, [router]);

  return <CustomLoader />;
}
