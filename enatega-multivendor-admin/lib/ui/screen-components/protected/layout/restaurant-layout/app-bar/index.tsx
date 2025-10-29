/* eslint-disable @next/next/no-img-element */

'use client';

// Core
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Icons
import {
  faBars,
  faBell,
  faChevronDown,
  faCog,
  faEllipsisV,
  faGlobe,
  faMap,
  faRightFromBracket,
  faTruck,
} from '@fortawesome/free-solid-svg-icons';

// UI Components
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';

// Prime React
import { Menu } from 'primereact/menu';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Layout
import { LayoutContext } from '@/lib/context/global/layout.context';

// Hooks
import { useUserContext } from '@/lib/hooks/useUser';

// Interface/Types
import {
  IRestaurantByIdResponse,
  LayoutContextProps,
} from '@/lib/utils/interfaces';

// Constants
import {
  APP_NAME,
  languageTypes,
  SELECTED_RESTAURANT,
  SELECTED_VENDOR,
  SELECTED_VENDOR_EMAIL,
} from '@/lib/utils/constants';

// Methods
import { onUseLocalStorage } from '@/lib/utils/methods';

// Styles
import classes from './app-bar.module.css';
import { AppLogo } from '@/lib/utils/assets/svgs/logo';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANT_PROFILE } from '@/lib/api/graphql';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@/lib/utils/types/locale';
import { setUserLocale } from '@/lib/utils/methods/locale';

const AppTopbar = () => {
  // Hooks
  const t = useTranslations();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const currentLocale = useLocale();

  // Local Storage
  const restaurantId = onUseLocalStorage('get', 'restaurantId');

  // States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false); // New state for the modal
  const [restaurantName, setRestaurantName] = useState('');

  // Queries
  const { data: restaurantData } = useQuery<
    IRestaurantByIdResponse | undefined,
    { id: string }
  >(GET_RESTAURANT_PROFILE, {
    variables: {
      id: restaurantId ?? '',
    },
  });

  // Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<Menu>(null);
  const languageMenuRef = useRef<Menu>(null);

  // Context
  const { showRestaurantSidebar } =
    useContext<LayoutContextProps>(LayoutContext);
  const { user, setUser } = useUserContext();

  // Handlers
  const onDevicePixelRatioChange = useCallback(() => {
    setIsMenuOpen(false);
    showRestaurantSidebar(false);
  }, [showRestaurantSidebar]);

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the clicked target is outside the container
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
      // Close the container or handle the click outside
    }
  };

  const onConfirmLogout = () => {
    setUser(null);
    onUseLocalStorage('delete', SELECTED_VENDOR);
    onUseLocalStorage('delete', SELECTED_VENDOR_EMAIL);
    onUseLocalStorage('delete', SELECTED_RESTAURANT);
    onUseLocalStorage('delete', `user-${APP_NAME}`);
    router.push('/authentication/login');
  };

  function onLocaleChange(value: string) {
    const locale = value as TLocale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  // Language Modal
  const model = languageTypes.map((lang) => ({
    label: lang.value.toUpperCase(),
    template(item: any) {
      return (
        <div
          className={`${currentLocale === lang.code ? 'bg-[#b1c748]' : ''} p-2 cursor-pointer`}
          onClick={() => onLocaleChange(lang.code)}
        >
          {item.label}
        </div>
      );
    },
    command: () => {
      onLocaleChange(lang.code);
    },
  }));

  // Use Effects
  useEffect(() => {
    // Listening to mouse down event
    document.addEventListener('mousedown', handleClickOutside);

    // Listen to window resize events
    window.addEventListener('resize', onDevicePixelRatioChange);

    return () => {
      // Cleanup listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', onDevicePixelRatioChange);
    };
  }, [onDevicePixelRatioChange]);

  const onRedirectToPage = (_route: string) => {
    router.push(_route);
  };

  useEffect(() => {
    if (restaurantData?.restaurant?.name) {
      setRestaurantName(restaurantData?.restaurant?.name);
    }
  }, [restaurantData?.restaurant?.name]);
  return (
    <div className={`${classes['layout-topbar']}`}>
      <div className="flex items-center cursor-pointer">
        <div id="sidebar-opening-icon">
          <button onClick={() => showRestaurantSidebar()}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <div onClick={() => onRedirectToPage('/admin/store/dashboard')}>
          <AppLogo />
        </div>
      </div>
      <div className="hidden items-center space-x-1 md:flex">
        <div
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837] cursor-pointer"
          onClick={(event) => languageMenuRef.current?.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup
          title="Languages"
        >
          <FontAwesomeIcon icon={faGlobe} />

          <Menu
            model={model}
            popup
            ref={languageMenuRef}
            id="popup_menu_right"
            popupAlignment="right"
            className="
        [&_.p-menu-list]:max-h-72 
        [&_.p-menu-list]:overflow-y-auto
        [&_.p-menu-list]:scrollbar-thin
        shadow-lg
      "
          />
        </div>
        <div
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837]"
          onClick={(event) => menuRef.current?.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup
        >
          <span>
            {user?.name ? user?.name : restaurantName ? restaurantName : ''}
          </span>

          <Image
            src={
              user?.image
                ? user.image
                : restaurantData?.restaurant?.image
                  ? restaurantData?.restaurant?.image
                  : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
            }
            alt="profile-img"
            height={32}
            width={32}
            className="h-8 w-8 select-none rounded-full"
          />
          <FontAwesomeIcon icon={faChevronDown} />
          <Menu
            model={[
              {
                label: t('Logout'),
                command: () => {
                  setLogoutModalVisible(true);
                },
              },
            ]}
            popup
            ref={menuRef}
            id="popup_menu_right"
            popupAlignment="right"
          />
        </div>
      </div>
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>
      {isMenuOpen && (
        <div
          className="absolute right-4 top-8 z-50 rounded-lg bg-white p-4 shadow-lg"
          ref={containerRef}
        >
          <div className="flex flex-col items-center space-y-4">
            <Image
              src={
                user?.image
                  ? user.image
                  : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
              }
              alt="profile-img"
              height={32}
              width={32}
              className="h-8 w-8 select-none rounded-full"
            />
            <FontAwesomeIcon icon={faBell} color="gray" />
            <TextIconClickable className="justify-between" icon={faMap} />
            <TextIconClickable className="justify-between" icon={faTruck} />
            <TextIconClickable className="justify-between" icon={faCog} />
            <TextIconClickable className="justify-between" icon={faGlobe} />
            <TextIconClickable
              onClick={() => () => {
                setLogoutModalVisible(true);
              }}
              className="cursor-pointer"
              icon={faRightFromBracket}
            />
          </div>
        </div>
      )}
      <CustomDialog
        title={t('Logout Confirmation')}
        message={t('Are you sure you want to logout?')}
        visible={isLogoutModalVisible}
        onHide={() => setLogoutModalVisible(false)}
        onConfirm={onConfirmLogout}
        loading={false} // Set to true if you have a loading state for logout
        buttonConfig={{
          primaryButtonProp: { label: t('Yes'), icon: 'pi pi-check' },
          secondaryButtonProp: { label: t('Cancel'), icon: 'pi pi-times' },
        }}
      />
    </div>
  );
};

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
