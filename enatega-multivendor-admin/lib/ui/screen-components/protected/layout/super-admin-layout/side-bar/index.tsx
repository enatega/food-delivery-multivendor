'use client';

// Core
import { useContext } from 'react';

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
  faCog,
  faHome,
  faSliders,
  faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

// Constants and Utiils
import useCheckAllowedRoutes from '@/lib/hooks/useCheckAllowedRoutes';

// Components
import SidebarItem from './side-bar-item';

function SuperAdminSidebar({ children }: IGlobalComponentProps) {
  const { isSuperAdminSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  return (
    <div className="relative">
      <aside
        id="app-sidebar"
        className={`box-border transform overflow-hidden transition-all duration-300 ease-in-out ${isSuperAdminSidebarVisible ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}`}
      >
        <nav
          className={`flex h-full flex-col border-r bg-white shadow-sm transition-opacity duration-300 ${isSuperAdminSidebarVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <ul className="flex-1 pl-2">{children}</ul>
        </nav>
      </aside>
    </div>
  );
}

export default function MakeSidebar() {
  const { isSuperAdminSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  const navBarItems: ISidebarMenuItem[] = [
    {
      text: 'My Website',
      route: 'https://multivendor.enatega.com/',
      isParent: true,
      icon: faUpRightFromSquare,
      isClickable: true,
      shouldOpenInNewTab: true,
    },
    {
      text: 'Home',
      route: '/home',
      isParent: true,
      icon: faHome,
      isClickable: true,
    },
    {
      text: 'General',
      route: '/general',
      isParent: true,
      icon: faCog,
      subMenu: useCheckAllowedRoutes([
        {
          text: 'Vendors',
          route: '/general/vendors',
          isParent: false,
        },
        {
          text: 'Stores',
          route: '/general/restaurants',
          isParent: false,
        },
        {
          text: 'Riders',
          route: '/general/riders',
          isParent: false,
        },
        {
          text: 'Users',
          route: '/general/users',
          isParent: false,
        },
        {
          text: 'Staff',
          route: '/general/staff',
          isParent: false,
        },
      ]),
      shouldShow: function () {
        return this.subMenu ? this.subMenu.length > 0 : false;
      },
    },
    {
      text: 'Management',
      route: '/management',
      isParent: true,
      icon: faSliders,
      subMenu: useCheckAllowedRoutes([
        {
          text: 'Configuration',
          route: '/management/configurations',
          isParent: false,
        },
        {
          text: 'Orders',
          route: '/management/orders',
          isParent: false,
        },
        {
          text: 'Coupons',
          route: '/management/coupons',
          isParent: false,
        },
        {
          text: 'Cuisine',
          route: '/management/cuisines',
          isParent: false,
        },
        {
          text: 'Banners',
          route: '/management/banners',
          isParent: false,
        },
        {
          text: 'Tipping',
          route: '/management/tippings',
          isParent: false,
        },
        {
          text: 'Commission Rate',
          route: '/management/commission-rates',
          isParent: false,
        },
        {
          text: 'Withdraw Request',
          route: '/management/withdraw-requests',
          isParent: false,
        },
        {
          text: 'Notification',
          route: '/management/notifications',
          isParent: false,
        },
      ]),
      shouldShow: function () {
        return this.subMenu ? this.subMenu.length > 0 : false;
      },
    },
  ];

  return (
    <>
      <SuperAdminSidebar>
        <div className="h-[90vh] overflow-y-auto overflow-x-hidden pr-2">
          {navBarItems.map((item, index) =>
            item.shouldShow && !item.shouldShow() ? null : (
              <SidebarItem
                key={index}
                expanded={isSuperAdminSidebarVisible}
                {...item}
              />
            )
          )}
        </div>
      </SuperAdminSidebar>
    </>
  );
}
