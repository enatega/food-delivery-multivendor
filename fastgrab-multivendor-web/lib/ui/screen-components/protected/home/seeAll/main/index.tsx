"use client"
// core
import React, { useCallback, useState } from "react";
// card component
import Card from "@/lib/ui/useable-components/card";
// hooks
import useQueryBySlug from "@/lib/hooks/useQueryBySlug";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
// useParams
import { useParams } from "next/navigation";
// heading component
import HomeHeadingSection from "@/lib/ui/useable-components/home-heading-section";
// square card
import SquareCard from "@/lib/ui/useable-components/square-card";
// interface
import { IRestaurant } from "@/lib/utils/interfaces/restaurants.interface";
import { IUserFavouriteQueryResponse } from "@/lib/utils/interfaces/favourite.restaurants.interface";
import { GET_USER_FAVOURITE } from "@/lib/api/graphql";
import { useQuery } from "@apollo/client";
import FavouriteCardsGrid from "@/lib/ui/useable-components/favourite-cards-grid";
import FavoritesEmptyState from "@/lib/ui/useable-components/favorites-empty-state";
import CardSkeletonGrid from "@/lib/ui/useable-components/card-skelton-grid";
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";
import { useRouter } from "next/navigation";
import AuthGuard from "@/lib/hoc/auth.guard";
// import { ICuisinesData } from "@/lib/utils/interfaces";

// Slugs for rendering cuisines-specific cards
// const CUISINE_SLUGS = new Set(["restaurant-cuisines", "grocery-cuisines"]);

// Slugs for rendering cards with logo/images for restaurants/stores
const RESTAURANT_SLUGS = new Set(["popular-restaurants", "popular-stores"]);
function SeeAllSection() {
  const router= useRouter()
  // Get slug from URL params
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const [isModalOpen, setIsModalOpen] = useState({value: false, id: ""});
    // Generate a formatted title from the slug
  let title = slug
  .replaceAll("-", " ")
  .replace(/^./, (str) => str.toUpperCase());

  // Queries
  
  // Get Fav Restaurants by using the query
  const {
    data: FavouriteRestaurantsData,
    loading: isFavouriteRestaurantsLoading,
  } = useQuery<IUserFavouriteQueryResponse>(GET_USER_FAVOURITE, {
    variables: {}, // Empty object for optional variables
    fetchPolicy: "network-only",
  });

    // Fetch data using slug
  const { data, loading, error } = useQueryBySlug(slug);
  
  // handlers
  // use debouncefunction if user click multiple times at once it will call function only 1 time
  const handleClickFavRestaurant = useDebounceFunction(
    (FavRestaurantId: string | undefined, shopType: string | undefined, slug: string | undefined) => {
      router.push( `/${shopType === "restaurant" ? "restaurant" : "store"}/${slug}/${FavRestaurantId}`);
    },
    500 // Debounce time in milliseconds
  );

  // Handle update is modal open
  const handleUpdateIsModalOpen = useCallback((value: boolean, id: string) => {
    if (isModalOpen.value !== value || isModalOpen.id !== id) {
      setIsModalOpen({ value, id });
    }
  }, [isModalOpen]);

// Create the protected layout component for the favourite restaurants
// This layout will be used to wrap the favourite restaurants section
const ProtectedLayout = ({ children }) => {
  return <div className="protected-container">{children}</div>;
};
// Create the guarded version of the layout
const ProtectedFavRestaurants = AuthGuard(ProtectedLayout);
  
  if(slug == "favourites") {
      return(
        <ProtectedFavRestaurants>
       <div className="w-full py-6 flex flex-col gap-6">
      <HomeHeadingSection title={title} showFilter={false} />
      {isFavouriteRestaurantsLoading ? (
        <CardSkeletonGrid count={4} />
      ) : FavouriteRestaurantsData?.userFavourite && FavouriteRestaurantsData.userFavourite.length > 0 ? (
        <FavouriteCardsGrid items={FavouriteRestaurantsData.userFavourite}
        handleClickFavRestaurant={handleClickFavRestaurant}
        type={"seeAllFavourites"}
        />
      ) : (
        <FavoritesEmptyState/>
      )}
       </div>
       </ProtectedFavRestaurants>
      )
  } 

  // Show skeleton loader while fetching
  if (loading) {
    return <SliderSkeleton />;
  }

  // Handle query error silently (can be extended with an error UI)
  if (error) {
    return <div>Error loading data</div>;
  }

  // If no data returned, show empty state
  if (!data?.length) return <div>No items found</div>;

  return (
    <>
      <HomeHeadingSection title={title} showFilter={false} />
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 items-center">
          {/* Render SquareCard for cuisine-related slugs */}
          {/* {Array.isArray(data) &&
            CUISINE_SLUGS.has(slug) &&
            (data as ICuisinesData[]).map((item) => (
              <SquareCard
                key={item._id}
                item={item}
                cuisines={true}
                showLogo={false} // No logo so it will show image for cuisines
              />
            ))} */}

          {/* Render SquareCard with logo for popular restaurants/stores */}
          {Array.isArray(data) &&
            RESTAURANT_SLUGS.has(slug) &&
            (data as IRestaurant[]).map((item) => (
              <SquareCard
                key={item._id}
                item={item}
                showLogo={true} // Show logo/image
              />
            ))}

          {/* Render default Card for any other slug types */}
          {Array.isArray(data) &&
            !RESTAURANT_SLUGS.has(slug) &&
            (data as IRestaurant[]).map((item) => (
              <Card key={item._id} item={item} isModalOpen={isModalOpen} handleUpdateIsModalOpen={handleUpdateIsModalOpen} />
            ))}
        </div>
      </div>
    </>
  );
}

export default SeeAllSection;
