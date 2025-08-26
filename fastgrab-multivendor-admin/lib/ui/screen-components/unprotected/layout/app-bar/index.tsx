/* eslint-disable @next/next/no-img-element */

'use client';

// Core
import Link from 'next/link';

// Assets
import { AppLogo } from '@/lib/utils/assets/svgs/logo';

// Styles
import classes from './app-bar.module.css';

const AppTopbar = () => {
  return (
    <div className={`${classes['layout-topbar']}`}>
      <div>
        <div className="flex flex-row items-center gap-6">
          <Link href="/" className="layout-topbar-log">
            <AppLogo />
          </Link>
        </div>
      </div>
    </div>
  );
};

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
