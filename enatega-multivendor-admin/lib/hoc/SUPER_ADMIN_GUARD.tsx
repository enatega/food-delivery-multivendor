'use client';
// Core
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';

// Hooks
import { useUserContext } from '@/lib/hooks/useUser';

// Constants and Utils
import { APP_NAME, ROUTES } from '@/lib/utils/constants';
import { onUseLocalStorage } from '@/lib/utils/methods';

const SUPER_ADMIN_GUARD = <T extends object>(
  Component: React.ComponentType<T>
) => {
  const WrappedComponent = (props: T) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useUserContext();

    const isLoggedIn = !!onUseLocalStorage('get', `user-${APP_NAME}`);
    const findRouteName = ROUTES.find((v) => v.route === pathname);
    const staffAllowed =
      user?.userType !== 'STAFF' ||
      !findRouteName ||
      !Array.isArray(user.permissions) ||
      user.permissions.includes(findRouteName.text);
    const isAllowed =
      isLoggedIn &&
      !!user &&
      user.userType !== 'RESTAURANT' &&
      user.userType !== 'VENDOR' &&
      staffAllowed;

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

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default SUPER_ADMIN_GUARD;
