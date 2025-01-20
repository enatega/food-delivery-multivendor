'use client';

// Core
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FoodManagementPage() {
  // Hooks
  const router = useRouter();

  // Effects
  useEffect(() => {
    router.push('/admin/store/food-management/food');
  }, []);

  return <></>;
}
