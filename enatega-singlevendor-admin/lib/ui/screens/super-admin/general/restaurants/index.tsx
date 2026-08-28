'use client';
import RestaurantsForm from '@/lib/ui/screen-components/protected/super-admin/restaurants/add-form';
import RestaurantsScreenHeader from '@/lib/ui/screen-components/protected/super-admin/restaurants/view/header/screen-header';
import RestaurantsScreenSubHeader from '@/lib/ui/screen-components/protected/super-admin/restaurants/view/header/screen-sub-header';
import RestaurantsMain from '@/lib/ui/screen-components/protected/super-admin/restaurants/view/main';

export default function RestaurantsScreen() {
  return (
    <div className="screen-container">
      <RestaurantsScreenHeader />
      <RestaurantsScreenSubHeader />
      <RestaurantsMain />
      <RestaurantsForm />
    </div>
  );
}
