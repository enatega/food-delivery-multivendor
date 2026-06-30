'use client';
// Core
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';

// Hooks
import { useUserContext } from '@/lib/hooks/useUser';

// Constants and Utils
import { APP_NAME } from '@/lib/utils/constants';
import { onUseLocalStorage } from '@/lib/utils/methods';

const RESTAURANT_GUARD = <T extends object>(
  Component: React.ComponentType<T>
) => {
  const WrappedComponent = (props: T) => {
    const router = useRouter();
    const { user, loading } = useUserContext();

    const isLoggedIn = !!onUseLocalStorage('get', `user-${APP_NAME}`);
    const isAllowed =
      isLoggedIn &&
      !!user &&
      (user.userType !== 'STAFF' ||
        !!(
          user.permissions?.includes('Restaurants') ||
          user.permissions?.includes('Stores')
        ));

    useEffect(() => {
      if (!isLoggedIn) {
        router.replace('/authentication/login');
        return;
      }
      if (!loading && !isAllowed) {
        router.replace('/forbidden');
      }
    }, [isAllowed, isLoggedIn, loading, router]);

    if (loading) {
      return <CustomLoader />;
    }

    if (!isAllowed) {
      return null;
    }

    // ADMIN/RESTAURANT is always allowed
    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default RESTAURANT_GUARD;
