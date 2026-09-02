'use client';
// Core
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';

// Hooks
import { useUserContext } from '@/lib/hooks/useUser';

// Constants and Utils
import { getAccessToken } from '@/lib/utils/methods/auth';

const VENDOR_GUARD = <T extends object>(Component: React.ComponentType<T>) => {
  const WrappedComponent = (props: T) => {
    const router = useRouter();
    const { user, loading, isSessionVerified } = useUserContext();

    const hasSessionToken = !!getAccessToken();
    const isAllowed =
      isSessionVerified &&
      !!user &&
      user.userType !== 'RESTAURANT' &&
      (user.userType !== 'STAFF' || !!user.permissions?.includes('Vendors'));

    useEffect(() => {
      if (!loading && !hasSessionToken) {
        router.replace('/authentication/login');
        return;
      }
      if (!loading && hasSessionToken && !isSessionVerified) {
        router.replace('/authentication/login');
        return;
      }
      if (!loading && !isAllowed) {
        router.replace('/forbidden');
      }
    }, [hasSessionToken, isAllowed, isSessionVerified, loading, router]);

    if (loading) {
      return <CustomLoader />;
    }

    if (!isAllowed) {
      return null;
    }

    // ADMIN/VENDOR is always allowed
    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default VENDOR_GUARD;
