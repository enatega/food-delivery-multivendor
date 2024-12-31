// Core
import { useContext, useState } from 'react';

// Context
import { LayoutContext } from '@/lib/context/global/layout.context';

// Interface & Types
import {
  IGlobalComponentProps,
  ISidebarMenuItem,
  LayoutContextProps,
} from '@/lib/utils/interfaces';

// Icons
import {
  faArrowLeft,
  faCog,
  faHome,
  faMoneyBillTrendUp,
  faRectangleList,
  faStar,
  faStore,
} from '@fortawesome/free-solid-svg-icons';

// Components
import SidebarItem from './side-bar-item';
import { useUserContext } from '@/lib/hooks/useUser';
import { onUseLocalStorage } from '@/lib/utils/methods';

function AdminSidebar({ children }: IGlobalComponentProps) {
  // Context
  const { isRestaurantSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  return (
    <div className="relative">
      <aside
        id="app-sidebar"
        className={`box-border transform overflow-hidden transition-all duration-300 ease-in-out ${isRestaurantSidebarVisible ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}`}
      >
        <nav
          className={`flex h-full flex-col border-r bg-white shadow-sm transition-opacity duration-300 ${isRestaurantSidebarVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <ul className="flex-1 pl-2">{children}</ul>
        </nav>
      </aside>
    </div>
  );
}

export default function MakeSidebar() {
  const { isRestaurantSidebarVisible } =
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
      route: '/admin/restaurant/dashboard',
      isParent: true,
      icon: faHome,
      isClickable: true,
    },

    {
      text: 'Store',
      route: '/admin/restaurant/general',
      isParent: true,
      icon: faStore,
      subMenu: [
        {
          text: 'Profile',
          route: '/admin/restaurant/profile',
          isParent: false,
        },
        {
          text: 'Timing',
          route: '/admin/restaurant/general/timing',
          isParent: false,
        },
        {
          text: 'Location',
          route: '/admin/restaurant/general/location',
          isParent: false,
        },
        {
          text:'Payment',
          route:"/admin/restaurant/general/payment",
          isParent:false,
        }
      ],
    },

    {
      text: 'Product Management',
      route: '/admin/restaurant/food-management',
      isParent: true,
      icon: faCog,
      subMenu: [
        {
          text: 'Products',
          route: '/admin/restaurant/food-management/food',
          isParent: false,
        },
        {
          text: 'Categories',
          route: '/admin/restaurant/food-management/category',
          isParent: false,
        },
        {
          text: 'Options',
          route: '/admin/restaurant/food-management/options',
          isParent: false,
        },
        {
          text: 'Addons',
          route: '/admin/restaurant/food-management/add-ons',
          isParent: false,
        },
      ],
    },

    {
      text: 'Orders',
      route: '/admin/restaurant/orders',
      isParent: true,
      icon: faRectangleList,
      isClickable:true
    },
    {
      text: 'Marketing',
      route: '/admin/restaurant/coupons',
      isParent: true,
      icon: faMoneyBillTrendUp,
      isClickable:true
    },
    {
      text: 'Reviews',
      route: '/admin/restaurant/ratings',
      isParent: true,
      icon: faStar,
      isClickable:true
    },
    {
      text: lastRoute ? `Back to ${lastRoute}` : 'Back',
      route: lastRoute == 'Vendor' ? `/admin/vendor/dashboard` : '/home',
      isParent: true,
      icon: faArrowLeft,
      isClickable: true,
      onClick: () => {
        // Handle popping the route and updating localStorage
        const updatedStack = [...routeStack];
        updatedStack.pop();
        onUseLocalStorage('save', 'routeStack', JSON.stringify(updatedStack));
        setRouteStack(updatedStack);
      },
      isLastItem: true,
      shouldShow: () => {
        return !(user?.userType === 'RESTAURANT');
      },
    },
  ];

  return (
    <>
      <AdminSidebar>
        <div className="h-[92vh] overflow-y-auto overflow-x-hidden pr-2">
          {navBarItems.map((item, index) =>
            item.shouldShow && !item.shouldShow() ? null : (
              <SidebarItem
                key={index}
                expanded={isRestaurantSidebarVisible}
                {...item}
              />
            )
          )}
        </div>
      </AdminSidebar>
    </>
  );
}
