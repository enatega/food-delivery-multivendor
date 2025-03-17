// Core
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Icons
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Interface & Types
import { ISidebarMenuItem, SubMenuItemProps } from '@/lib/utils/interfaces';

// Styles
import classes from './side-bar.module.css';
import { onUseLocalStorage } from '@/lib/utils/methods';
import { SELECTED_SIDEBAR_MENU } from '@/lib/utils/constants';

// This component is used to render the sub-menu items when hovered
function HoveredSubMenuItem({ icon, text, active }: SubMenuItemProps) {
  return (
    <div
      className={`my-3 rounded-md p-2 ${
        active ? 'bg-gray-300' : 'hover:bg-indigo-50'
      }`}
    >
      <div className="flex items-center justify-center">
        {icon && (
          <span className="text-primary-500 h-6 w-6">
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
        <span className="text-primary-500 ml-3 w-28 text-start">{text}</span>
        <div className="bg-primary-200 h-1" />
      </div>
    </div>
  );
}

export default function SidebarItem({
  icon,
  text,
  expanded = false,
  subMenu = null,
  route,
  isParent,
  isClickable,
}: ISidebarMenuItem) {
  // States
  const [expandSubMenu, setExpandSubMenu] = useState(false);

  // Hooks
  const pathname = usePathname();
  const router = useRouter();

  // use Effect
  useEffect(() => {
    if (!expanded) {
      setExpandSubMenu(false);
    }
  }, [expanded]);

  // Calculate the height of the sub-menu assuming each item is 40px tall
  const subMenuHeight = expandSubMenu
    ? `${((subMenu?.length || 0) * 41.5 + (subMenu! && 15)).toString()}px`
    : 0;

  // Defaults
  const bg_color = pathname.includes(route ?? '')
    ? isParent
      ? 'primary-color'
      : 'secondary-color'
    : '[#71717A]';

  const text_color = pathname.includes(route ?? '') ? 'white' : '[#71717A]';
  const isActive = pathname.includes(route ?? '');

  return (
    <div className={`mt-[0.4rem] flex flex-col`}>
      <div>
        <button
          className={`group relative flex w-full cursor-pointer items-center rounded-md px-3 py-2 transition-colors ${
            isActive && !subMenu
              ? `bg-${isClickable ? bg_color : ''} text-${isClickable ? text_color : '[#71717A]'}`
              : `bg-${bg_color} text-${text_color} hover:bg-secondary-color`
          } ${!expanded && 'hidden sm:flex'} `}
          onClick={() => {
            if (!isParent || isClickable) {
              if (
                route === 'https://hedgego.com.au/' ||
                route === 'https://hedge.net.au/become-a-stockist'
              ) {
                window.open(route, '_blank');
              } else {
                router.push(route ?? '');
              }
              return;
            }

            setExpandSubMenu((curr) => expanded && !curr);
            onUseLocalStorage('save', SELECTED_SIDEBAR_MENU, text);
          }}
        >
          {icon && (
            <span className="card-h1 w-6">
              <FontAwesomeIcon icon={icon} />
            </span>
          )}

          <span
            className={`card-h2 text-${isParent ? 'md' : 'sm'} overflow-hidden text-start transition-all ${
              expanded ? 'ml-3 w-44' : 'w-0'
            }`}
          >
            {text}
          </span>
          {subMenu && (
            <div
              className={`absolute right-2 h-4 w-4${expanded ? '' : 'top-2'} transition-all ${expandSubMenu ? 'rotate-90' : 'rotate-0'}`}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          )}

          {!expanded && (
            <div
              className={`text-primary-500 invisible absolute left-full ml-6 -translate-x-3 rounded-md bg-indigo-100 px-2 py-1 text-sm opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
            >
              {!subMenu
                ? text
                : subMenu.map((item, index) => (
                    <HoveredSubMenuItem
                      key={index}
                      text={item.text}
                      icon={item.icon}
                      active={isActive}
                    />
                  ))}
            </div>
          )}
        </button>
      </div>
      <ul
        className={`${classes['sub-menu']} relative pl-6`}
        style={{ height: subMenuHeight }}
      >
        <div className="absolute bottom-0 left-6 top-0 w-px bg-gray-300"></div>

        {(expanded ||
          onUseLocalStorage('get', SELECTED_SIDEBAR_MENU) === text) &&
          subMenu?.map((item, index) => {
            const isActive = pathname.includes(item.route ?? '');
            return (
              <li key={index} className="relative">
                {isActive && (
                  <div className="absolute -left-[0.26rem] top-1/2 z-10 h-2 w-2 -translate-y-1/2 transform rounded-full bg-green-500"></div>
                )}
                <SidebarItem {...item} expanded={expanded} />
              </li>
            );
          })}
      </ul>
    </div>
  );
}
