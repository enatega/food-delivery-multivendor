/* eslint-disable react-hooks/exhaustive-deps */
'use client';

// Interface
import { IProvider } from '@/lib/utils/interfaces';

const HomeLayout = ({ children }: IProvider) => {
  return <div className="h-full px-4">{children}</div>;
};

export default HomeLayout;
