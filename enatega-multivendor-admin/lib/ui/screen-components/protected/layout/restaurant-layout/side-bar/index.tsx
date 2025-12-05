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
  faWallet,
} from '@fortawesome/free-solid-svg-icons';

// Components
import SidebarItem from './side-bar-item';
import { useUserContext } from '@/lib/hooks/useUser';
import { onUseLocalStorage } from '@/lib/utils/methods';
import { useTranslations } from 'next-intl';

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
          className={`flex h-full flex-col border-r bg-white dark:bg-dark-950 shadow-sm transition-opacity duration-300 ${isRestaurantSidebarVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <ul className="flex-1 pl-2">{children}</ul>
        </nav>
      </aside>
    </div>
  );
}

export default function MakeSidebar() {
  // Hooks
  const t = useTranslations();

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
      text: t('Dashboard'),
      route: '/admin/store/dashboard',
      isParent: true,
      icon: faHome,
      isClickable: true,
    },

    {
      text: t('Store'),
      route: '/admin/store/general',
      isParent: true,
      icon: faStore,
      subMenu: [
        {
          text: t('Profile'),
          route: '/admin/store/profile',
          isParent: false,
        },
        {
          text: t('Timing'),
          route: '/admin/store/general/timing',
          isParent: false,
        },
        {
          text: t('Location'),
          route: '/admin/store/general/location',
          isParent: false,
        },
        {
          text: t('Payment'),
          route: '/admin/store/general/payment',
          isParent: false,
        },
      ],
    },

    {
      text: t('Product Management'),
      route: '/admin/store/product-management',
      isParent: true,
      icon: faCog,
      subMenu: [
        {
          text: t('Products'),
          route: '/admin/store/product-management/food',
          isParent: false,
        },
        {
          text: t('Categories'),
          route: '/admin/store/product-management/category',
          isParent: false,
        },
        {
          text: t('Options'),
          route: '/admin/store/product-management/options',
          isParent: false,
        },
        {
          text: t('Addons'),
          route: '/admin/store/product-management/add-ons',
          isParent: false,
        },
      ],
    },

    {
      text: t('Wallet'),
      route: '/admin/store/wallets',
      isParent: true,
      icon: faWallet,
      subMenu: [
        {
          text: t('Transaction History'),
          route: '/admin/store/wallets/transaction-history',
          isParent: false,
        },
        {
          text: t('Withdrawal Request'),
          route: '/admin/store/wallets/withdrawal-request',
          isParent: false,
        },
        {
          text: t('Earnings'),
          route: '/admin/store/wallets/earnings',
          isParent: false,
        },
      ],
    },

    {
      text: t('Orders'),
      route: '/admin/store/orders',
      isParent: true,
      icon: faRectangleList,
      isClickable: true,
    },
    {
      text: t('Marketing'),
      route: '/admin/store/coupons',
      isParent: true,
      icon: faMoneyBillTrendUp,
      isClickable: true,
    },
    {
      text: t('Reviews'),
      route: '/admin/store/ratings',
      isParent: true,
      icon: faStar,
      isClickable: true,
    },
    {
      text: lastRoute ? t(`Back to ${lastRoute}`) : 'Back',
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
