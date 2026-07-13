'use client';
// Core
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Hooks
import { useUserContext } from '@/lib/hooks/useUser';

// Constants and Utils
import { APP_NAME } from '@/lib/utils/constants';
import { onUseLocalStorage } from '@/lib/utils/methods';

const VENDOR_GUARD = <T extends object>(Component: React.ComponentType<T>) => {
  const WrappedComponent = (props: T) => {
    const router = useRouter();
    const { user } = useUserContext();

    useEffect(() => {
      // Check if logged in
      const isLoggedIn = !!onUseLocalStorage('get', `user-${APP_NAME}`);
      if (!isLoggedIn) {
        router.replace('/authentication/login');
      }

      // For STAFF => Check if VENDOR permission is given to STAFF
      if (user && user.userType === 'STAFF') {
        const allowed = user?.permissions?.includes('Vendors');

        if (!allowed) {
          router.replace('/forbidden');
        }
      }

      // For RESTAURANT
      if (user?.userType === 'RESTAURANT') {
        router.replace('/forbidden');
      }
    }, []);

    // ADMIN/VENDOR is always allowed
    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default VENDOR_GUARD;
