/* eslint-disable @next/next/no-img-element */

'use client';

// Core
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Icons
import {
  faBars,
  faChevronDown,
  faEllipsisV,
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
import { LayoutContextProps } from '@/lib/utils/interfaces';

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

const VendorAppTopbar = () => {
  // States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false); // New state for the modal

  // Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<Menu>(null);

  // Context
  const { showVendorSidebar } = useContext<LayoutContextProps>(LayoutContext);
  const { user, setUser } = useUserContext();

  // Hooks
  const router = useRouter();

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
      <div className="hidden items-center space-x-6 md:flex">
        <div
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837]"
          onClick={(event) => menuRef.current?.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup
        >
          <span>{user?.name ?? ''}</span>

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

          <FontAwesomeIcon icon={faChevronDown} />
          <Menu
            model={[
              {
                label: 'Logout',
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
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        visible={isLogoutModalVisible}
        onHide={() => setLogoutModalVisible(false)}
        onConfirm={onConfirmLogout}
        loading={false} // Set to true if you have a loading state for logout
        buttonConfig={{
          primaryButtonProp: { label: 'Yes', icon: 'pi pi-check' },
          secondaryButtonProp: { label: 'Cancel', icon: 'pi pi-times' },
        }}
      />
    </div>
  );
};

VendorAppTopbar.displayName = 'VendorAppTopbar';

export default VendorAppTopbar;
