'use client';

// Core
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

// Context
import { SidebarContext } from '@/lib/context/global/sidebar.context';

// Interface & Types
import { ISidebarContextProps } from '@/lib/utils/interfaces';
import { DEFAULT_ROUTES } from '@/lib/utils/constants/routes';
import { useUserContext } from '@/lib/hooks/useUser';
import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';

export default function RootPage() {
  // Context
  const { setSelectedItem } = useContext<ISidebarContextProps>(SidebarContext);
  const { user, loading, isSessionVerified } = useUserContext();

  // Hooks
  const router = useRouter();

  // Effects
  useEffect(() => {
    setSelectedItem({ screenName: 'Home' });
    if (loading) return;

    if (isSessionVerified && user) {
      router.push(DEFAULT_ROUTES[user.userType]);
    } else {
      router.replace('/authentication/login');
    }
  }, [isSessionVerified, loading, router, setSelectedItem, user]);

  if (loading) {
    return <CustomLoader />;
  }

  return <></>;
}
