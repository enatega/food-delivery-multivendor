/* eslint-disable react-hooks/exhaustive-deps */
'use client';

// Components
import AppTopbar from '@/lib/ui/screen-components/unprotected/layout/app-bar';

// Interface & Types
import { IProvider } from '@/lib/utils/interfaces';

const Layout = ({ children }: IProvider) => {
  return (
    <div className="layout-main">
      <div className="layout-top-container">
        <AppTopbar />
      </div>
      <div className="layout-main-container">
        <div className="layout-main">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
