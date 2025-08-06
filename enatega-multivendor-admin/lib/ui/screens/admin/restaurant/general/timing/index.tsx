"use client"
import { GET_RESTAURANT_PROFILE } from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import TimingAddForm from '@/lib/ui/screen-components/protected/restaurant/timing/add-form';
import DeliveryOptions from '@/lib/ui/screen-components/protected/restaurant/timing/deliveryOptions';
import TimingHeader from '@/lib/ui/screen-components/protected/restaurant/timing/view/header';
import { useQuery } from '@apollo/client';
import { useContext } from 'react';

const TimingScreen = () => {
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';


  const { data, loading, refetch } = useQuery(GET_RESTAURANT_PROFILE, {
    fetchPolicy: 'cache-and-network',
    variables: { id: restaurantId },
  });

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden p-3">
      <TimingHeader />
      <div className='flex gap-4'>
        <div className='flex-[0.6]'>
          <TimingAddForm data={data} loading={loading} refetch={refetch} />
        </div>
        <div className='flex-[0.4]'>
          <DeliveryOptions data={data} loading={loading} refetch={refetch} />
        </div>
      </div>
    </div>
  );
};

export default TimingScreen;
