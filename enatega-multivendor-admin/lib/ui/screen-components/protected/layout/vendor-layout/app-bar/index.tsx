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
import Image from 'next/image';

// Icons
import {
  faBars,
  faChevronDown,
  faEllipsisV,
  faGlobe,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

// UI Components
import { Menu } from 'primereact/menu';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';

// Prime React
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Layout
import { LayoutContext } from '@/lib/context/global/layout.context';

// Hooks
import { useUserContext } from '@/lib/hooks/useUser';
import { useRouter } from 'next/navigation';

// Interface/Types
import {
  ISingleVendorResponseGraphQL,
  LayoutContextProps,
} from '@/lib/utils/interfaces';

// Constants
import {
  APP_NAME,
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
import { GET_VENDOR_BY_ID } from '@/lib/api/graphql';
import { useLocale, useTranslations } from 'next-intl';
import { setUserLocale } from '@/lib/utils/methods/locale';
import { TLocale } from '@/lib/utils/types/locale';

const VendorAppTopbar = () => {
  // Hooks
  const t = useTranslations();
  const currentLocale = useLocale();

  // Local Storage
  const vendorId = onUseLocalStorage('get', 'vendorId');

  // States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false); // New state for the modal
  const [vendorName, setVendorName] = useState('');

  // Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<Menu>(null);
  const languageMenuRef = useRef<Menu>(null);

  // Context
  const { showVendorSidebar } = useContext<LayoutContextProps>(LayoutContext);
  const { user, setUser } = useUserContext();

  // Hooks
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Queries
  const { data: vendorData } = useQuery<
    ISingleVendorResponseGraphQL | undefined,
    { id: string }
  >(GET_VENDOR_BY_ID, {
    variables: {
      id: vendorId ?? '',
    },
  });

  // Handlers
  const onDevicePixelRatioChange = useCallback(() => {
    setIsMenuOpen(false);
    showVendorSidebar(false);
  }, [showVendorSidebar]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false); // Close the container or handle the click outside
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

  const onRedirectToPage = (_route: string) => {
    router.push(_route);
  };

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

  useEffect(() => {
    if (vendorData?.getVendor?.name) {
      setVendorName(vendorData?.getVendor?.name);
    }
  }, [vendorData?.getVendor?.name]);
  return (
    <div className={`${classes['layout-topbar']}`}>
      <div className="flex items-center cursor-pointer">
        <div id="sidebar-opening-icon">
          <button onClick={() => showVendorSidebar()}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <div onClick={() => onRedirectToPage('/home')}>
          <AppLogo />
        </div>
      </div>
      <div className="hidden items-center space-x-1 md:flex">
        <div
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837]"
          onClick={(event) => languageMenuRef.current?.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup
        >
          <FontAwesomeIcon icon={faGlobe} />

          <Menu
             model={[
              {
                label: 'ENGLISH',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'en' ? 'bg-green-300' : ''} p-2 `}
                      onClick={()=>onLocaleChange('en')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('en');
                },
              },
              {
                label: 'ARABIC',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'ar' ? 'bg-green-300' : ''} p-2 `}
                      onClick={()=>onLocaleChange('ar')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('ar');
                },
              },
              {
                label: 'FRENCH',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'fr' ? 'bg-green-300' : ''} p-2 `}
                      onClick={()=>onLocaleChange('fr')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('fr');
                },
              },
              {
                label: 'KHMER',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'km' ? 'bg-green-300' : ''} p-2 `}
                      onClick={()=>onLocaleChange('km')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('km');
                },
              },
              {
                label: 'CHINESE',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'zh' ? 'bg-green-300' : ''} p-2 `}
                      onClick={()=>onLocaleChange('zh')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('zh');
                },
              },
              {
                label: 'HEBREW',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'he' ? 'bg-green-300' : ''} p-2 `}
                      onClick={()=>onLocaleChange('he')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('he');
                },
              },
            ]}
            popup
            ref={languageMenuRef}
            id="popup_menu_right"
            popupAlignment="right"
          />
        </div>
        <div
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837]"
          onClick={(event) => menuRef.current?.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup
        >
          <span>{user?.name ? user?.name : vendorName ? vendorName : ''}</span>

          <Image
            src={
              user?.image
                ? user.image
                : vendorData?.getVendor?.image
                  ? vendorData?.getVendor?.image
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
            <TextIconClickable
              onClick={() => {
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

VendorAppTopbar.displayName = 'VendorAppTopbar';

export default VendorAppTopbar;
