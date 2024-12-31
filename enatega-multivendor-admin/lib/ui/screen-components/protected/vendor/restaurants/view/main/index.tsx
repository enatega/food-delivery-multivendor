// Core
import { useContext } from 'react';

// UI Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import CustomRestaurantCardSkeleton from '@/lib/ui/useable-components/custom-skeletons/restaurant.card.skeleton';

// Context
import { VendorLayoutRestaurantContext } from '@/lib/context/vendor/restaurant.context';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import NoData from '@/lib/ui/useable-components/no-data';
import VendorsLayoutRestaurantCard from '@/lib/ui/useable-components/vendors-layout-resturant-card';

export default function VendorRestaurantsMain() {
  const {
    onSetRestaurantFormVisible,
    restaurantByOwnerResponse,
    restaurantContextData,
    onSetRestaurantContextData,
  } = useContext(VendorLayoutRestaurantContext);

  const restaurants = restaurantContextData?.globalFilter
    ? restaurantContextData?.filtered
    : restaurantByOwnerResponse?.data?.restaurantByOwner?.restaurants;

  return (
    <div className="flex flex-grow flex-col overflow-hidden sm:flex-row">
      <div className={`flex-1 overflow-y-auto border-l border-gray-200 px-2`}>
        {/* Header for Restaurants section */}
        <div className="border-b pb-2 pt-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="hidden sm:block">
              <HeaderText text="Stores" />
            </div>
            <div className="flex flex-col sm:hidden">
              <HeaderText text="Stores" />
            </div>
            <TextIconClickable
              className="rounded border-gray-300 bg-black text-white sm:w-auto"
              icon={faAdd}
              iconStyles={{ color: 'white' }}
              title="Add Store"
              onClick={() => onSetRestaurantFormVisible(true)}
            />
          </div>
          <div className="flex flex-col items-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:items-center">
            <div className="w-full sm:w-60">
              <CustomTextField
                type="text"
                name="restaurantFilter"
                maxLength={35}
                placeholder="Search Stores"
                showLabel={false}
                value={restaurantContextData?.globalFilter ?? ''}
                onChange={(e) =>
                  onSetRestaurantContextData({
                    globalFilter: e.target.value,
                  })
                }
              />
            </div>
            {/* <CustomTab
              options={options}
              selectedTab={selectedRestaurantFilter}
              setSelectedTab={setSelectedResturantFilter}
            /> */}
          </div>
        </div>

        <div className="pt- grid grid-cols-1 gap-6 pb-16 pt-2 lg:grid-cols-2 xl:grid-cols-3">
          {restaurantByOwnerResponse?.loading ? (
            new Array(10)
              .fill(0)
              .map((_, i: number) => <CustomRestaurantCardSkeleton key={i} />)
          ) : restaurants?.length !== 0 ? (
            restaurants?.map((restaurant) => (
              <VendorsLayoutRestaurantCard
                key={restaurant?._id}
                restaurant={restaurant}
              />
            ))
          ) : !restaurants ? (
            <div className="col-span-full flex h-64 items-centerjustify-center px-4">
              <NoData />
            </div>
          ) : (
            <div className="col-span-full flex h-64 items-center justify-center px-4">
              <NoData />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
