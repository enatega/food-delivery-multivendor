// Core
import { useContext, useState } from 'react';

// Context
import { LayoutContext } from '@/lib/context/global/layout.context';
import { useUserContext } from '@/lib/hooks/useUser';

// Interface & Types
import {
  IGlobalComponentProps,
  ISidebarMenuItem,
  LayoutContextProps,
} from '@/lib/utils/interfaces';

// Icons
import {
  faArrowLeft,
  faHome,
  faUser,
  faStore,
} from '@fortawesome/free-solid-svg-icons';

// Components
import SidebarItem from './side-bar-item';
import { onUseLocalStorage } from '@/lib/utils/methods';

function VendorSidebar({ children }: IGlobalComponentProps) {
  // Context
  const { isVendorSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  return (
    <div className="relative">
      <aside
        id="app-sidebar"
        className={`box-border transform overflow-hidden transition-all duration-300 ease-in-out ${isVendorSidebarVisible ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}`}
      >
        <nav
          className={`flex h-full flex-col border-r bg-white shadow-sm transition-opacity duration-300 ${isVendorSidebarVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <ul className="flex-1 pl-2">{children}</ul>
        </nav>
      </aside>
    </div>
  );
}

export default function MakeVendorSidebar() {
  const { isVendorSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);
  const { user } = useUserContext();
  // Get the current route stack from localStorage without modifying it
  const [routeStack, setRouteStack] = useState<string[]>(
    JSON.parse(onUseLocalStorage('get', 'routeStack') || '[]')
  );
  const lastRoute =
    routeStack.length > 0 ? routeStack[routeStack.length - 1] : null;

  const navBarItems: ISidebarMenuItem[] = [
    {
      text: 'Dashboard',
      route: '/admin/vendor/dashboard',
      isParent: true,
      icon: faHome,
      isClickable: true,
    },
    {
      text: 'Profile',
      route: '/admin/vendor/profile',
      isParent: true,
      icon: faUser,
      isClickable: true,
    },
    {
      text: 'Stores',
      route: '/admin/vendor/stores',
      isParent: true,
      icon: faStore,
      isClickable: true,
    },
  ];

  if (user?.userType === 'ADMIN' || user?.userType === 'STAFF') {
    console.log(lastRoute);
    navBarItems.push({
      text: lastRoute ? `Back to ${lastRoute}` : 'Back',
      route: '/general/vendors',
      isParent: true,
      icon: faArrowLeft,
      isClickable: true,
      isLastItem: true,
      onClick: () => {
        // Handle popping the route and updating localStorage
        const updatedStack = [...routeStack];
        updatedStack.pop();
        onUseLocalStorage('save', 'routeStack', JSON.stringify(updatedStack));
        setRouteStack(updatedStack); // Update local state
      },
    });
  }

  return (
    <>
      <VendorSidebar>
        <div className="h-[92vh] overflow-y-auto overflow-x-hidden pr-2">
          {navBarItems.map((item, index) => (
            <SidebarItem
              key={index}
              expanded={isVendorSidebarVisible}
              {...item}
            />
          ))}
        </div>
      </VendorSidebar>
    </>
  );
}
