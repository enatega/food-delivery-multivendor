'use client';
import React, { useState } from 'react';
import {
  TabView,
  TabPanel,
  TabPanelHeaderTemplateOptions,
} from 'primereact/tabview';
import UserCard from '@/lib/ui/screen-components/protected/super-admin/user-detail/user-card';
import PersonalInfo from '@/lib/ui/screen-components/protected/super-admin/user-detail/personal-info';
import Addresses from '@/lib/ui/screen-components/protected/super-admin/user-detail/addresses';
import OrderHistory from '@/lib/ui/screen-components/protected/super-admin/user-detail/order-history';
import HeaderText from '@/lib/ui/useable-components/header-text';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { IUserResponse } from '@/lib/utils/interfaces/users.interface';
import { IOrdersByUserResponse } from '@/lib/utils/interfaces/orders.interface';
import { Card } from 'primereact/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@apollo/client';

import { GET_ORDERS_BY_USER } from '@/lib/api/graphql/queries/order';
import { GET_USER_BY_ID } from '@/lib/api/graphql';
import { IExtendedOrder } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

interface UserDetailScreenProps {
  userId: string;
}

const UserDetailScreen: React.FC<UserDetailScreenProps> = ({ userId }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const t = useTranslations();

  // Fetch user data
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery<{ user: IUserResponse }>(GET_USER_BY_ID, {
    variables: { userId },
    fetchPolicy: 'cache-and-network',
  });

  // Fetch order history
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // Number of orders per page
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
  } = useQuery<{ ordersByUser: IOrdersByUserResponse }>(GET_ORDERS_BY_USER, {
    variables: { userId, page: currentPage, limit },
    fetchPolicy: 'cache-and-network',
  });

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Card
          title="Invalid User ID"
          className="shadow-md border border-orange-300 bg-orange-50 text-orange-800"
        >
          <p className="mb-3">
            No user ID was provided. Please ensure you are accessing this page
            with a valid user ID.
          </p>
          <div className="mt-4 flex justify-end">
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              className="p-button-secondary"
              onClick={() => router.back()}
            />
          </div>
        </Card>
      </div>
    );
  }

  if (userLoading || ordersLoading) {
    return (
      <div className="p-4 md:p-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton shape="circle" size="2.5rem" className="mr-2"></Skeleton>
          <Skeleton width="10rem" height="2.5rem"></Skeleton>
        </div>

        {/* User Card Skeleton */}
        <div className="card mt-6">
          <div className="flex items-center p-4">
            <Skeleton shape="circle" size="6rem" className="mr-4"></Skeleton>
            <div>
              <Skeleton width="15rem" height="2rem" className="mb-2"></Skeleton>
              <Skeleton width="10rem" height="1rem" className="mb-1"></Skeleton>
              <Skeleton width="8rem" height="1rem"></Skeleton>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="card mt-6">
          <div className="flex border-b border-gray-300">
            <Skeleton width="8rem" height="2.5rem" className="mr-2"></Skeleton>
            <Skeleton width="8rem" height="2.5rem" className="mr-2"></Skeleton>
            <Skeleton width="8rem" height="2.5rem"></Skeleton>
          </div>
          <div className="p-4">
            <Skeleton width="100%" height="10rem"></Skeleton>
          </div>
        </div>
      </div>
    );
  }

  if (userError || ordersError) {
    const errorMessage =
      userError?.message ||
      ordersError?.message ||
      'An unknown error occurred.';
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Card
          title="Error Loading User Details"
          className="shadow-md border border-red-300 bg-red-50 text-red-800"
        >
          <p className="mb-3">
            We encountered an issue while trying to fetch the user&apos;s data.
          </p>
          <p className="font-semibold">Details: {errorMessage}</p>
          <p className="mt-3 text-sm">
            Please check your network connection or contact support if the issue
            persists.
          </p>
          <div className="mt-4 flex justify-end">
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              className="p-button-secondary"
              onClick={() => router.back()}
            />
          </div>
        </Card>
      </div>
    );
  }

  const user: IUserResponse | undefined = userData?.user;
  const orders: IExtendedOrder[] = ordersData?.ordersByUser?.orders || [];
  const totalOrders: number = ordersData?.ordersByUser?.totalCount || 0;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Card
          title="User Not Found"
          className="shadow-md border border-orange-300 bg-orange-50 text-orange-800"
        >
          <p className="mb-3">The requested user could not be found.</p>
          <div className="mt-4 flex justify-end">
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              className="p-button-secondary"
              onClick={() => router.back()}
            />
          </div>
        </Card>
      </div>
    );
  }

  const NoAddressesCard = () => (
    <div className="p-4">
      <Card
        title="No Addresses Found"
        className="shadow-md border border-gray-200 bg-gray-50"
      >
        <p>This user has not added any addresses yet.</p>
      </Card>
    </div>
  );

  const tabs = [
    { label: t('personal_info'), content: <PersonalInfo user={user} /> },
    {
      label: t('Addresses'),
      content:
        user.addresses && user.addresses.length > 0 ? (
          <Addresses addresses={user.addresses} />
        ) : (
          <NoAddressesCard />
        ),
    },
    {
      label: t('order_history'),
      content: (
        <OrderHistory
          orders={orders}
          totalRecords={totalOrders}
          rowsPerPage={limit}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLimitChange={setLimit}
        />
      ),
    },
  ];

  const tabHeaderTemplate = (
    options: TabPanelHeaderTemplateOptions,
    tab: { label: string },
    index: number
  ) => {
    const selected = activeIndex === index;
    return (
      <a
        className={`
          p-tabview-nav-link
          flex-1 text-center rounded-none
          ${
            selected
              ? 'border-b-2 border-primary-color text-primary-color dark:bg-dark-900'
              : 'text-gray-600 hover:text-primary-color dark:bg-dark-900 dark:text-dark-600'
          }
          p-4 font-semibold cursor-pointer transition-colors duration-200
        `}
        onClick={options.onClick}
      >
        {tab.label}
      </a>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          className="p-button-secondary border px-3 py-2.5 rounded-full p-button-sm button-rounded"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} scale={1.5} />{' '}
          {/* Use FontAwesomeIcon here */}
        </Button>

        <HeaderText text={t('user_details')} />
      </div>
      <div className="mt-6 h-[calc(100vh-150px)] overflow-y-auto">
        <UserCard user={user} />
        <div className="card mt-6 mb-20 border shadow-sm !rounded-xl">
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            pt={{
              nav: { className: 'border-b border-gray-300' },
            }}
          >
            {tabs.map((tab, index) => (
              <TabPanel
                key={index}
                headerTemplate={(options) =>
                  tabHeaderTemplate(options, tab, index)
                }
              >
                {tab.content}
              </TabPanel>
            ))}
          </TabView>
        </div>
      </div>
    </div>
  );
};

export default UserDetailScreen;
