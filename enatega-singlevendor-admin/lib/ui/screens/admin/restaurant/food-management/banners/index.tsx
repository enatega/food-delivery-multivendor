'use client';
// Components
import BannerRestaurantAddForm from '@/lib/ui/screen-components/protected/restaurant/banners/add-form';
import BannerRestaurantHeader from '@/lib/ui/screen-components/protected/restaurant/banners/view/header/screen-header';
import BannerRestaurantMain from '@/lib/ui/screen-components/protected/restaurant/banners/view/main';

// State - Render Prop
import BannerRestaurantStateProvider from '@/lib/states/BannerRestaurant';
import { useContext } from 'react';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

export default function BannerRestaurantScreen() {
  
    const {restaurantLayoutContextData} = useContext(RestaurantLayoutContext);

    const {restaurantId} = restaurantLayoutContextData
    console.log("🚀 ~ BannerRestaurantScreen ~ restaurantId:", restaurantId)

  return (
    <div className="screen-container">
      <BannerRestaurantStateProvider
        render={({
          banner,
          setBanner,
          isAddBannerVisible,
          setIsAddBannerVisible,
        }) => (
          <>
            <BannerRestaurantHeader setIsAddBannerVisible={setIsAddBannerVisible} />
            <BannerRestaurantMain
              setIsAddBannerVisible={setIsAddBannerVisible}
              setBanner={setBanner}
              restaurantId={restaurantId}
            />
            <BannerRestaurantAddForm
              banner={banner}
              onHide={() => {
                setIsAddBannerVisible(false);
                setBanner(null);
              }}
              isAddBannerVisible={isAddBannerVisible}
              restaurantId={restaurantId}
            />
          </>
        )}
      ></BannerRestaurantStateProvider>
    </div>
  );
}