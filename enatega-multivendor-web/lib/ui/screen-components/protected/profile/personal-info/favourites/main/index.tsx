"use client";

import type React from "react";
import { useRouter } from "next/navigation";
// Queries

import { useQuery } from "@apollo/client";
import { GET_USER_FAVOURITE } from "@/lib/api/graphql";
//Interfaces
import { IUserFavouriteQueryResponse } from "@/lib/utils/interfaces/favourite.restaurants.interface";
// Components
import FavouriteCardsGrid from "@/lib/ui/useable-components/favourite-cards-grid";
import CardSkeletonGrid from "@/lib/ui/useable-components/card-skelton-grid";
import HeaderFavourite from "../header";
import FavoritesEmptyState from "@/lib/ui/useable-components/favorites-empty-state";
//Methods
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";

const FavouriteProducts = () => {
  const router= useRouter()
  // Get Fav Restaurants by using the query
  const {
    data: FavouriteRestaurantsData,
    loading: isFavouriteRestaurantsLoading,
  } = useQuery<IUserFavouriteQueryResponse>(GET_USER_FAVOURITE, {
    variables: {}, // Empty object for optional variables
    fetchPolicy: "network-only",
  });
  
  //Handlers
  // Handle See All Click
  const handleSeeAllClick = useDebounceFunction(() => {
    // use route state to handle fetching all favourites Restaurants on that page
    router.push("/see-all/favourites");
  }, 500);

  // use debouncefunction if user click multiple times at once it will call function only 1 time
  const handleClickFavRestaurant = useDebounceFunction(
    (FavRestaurantId: string | undefined, shopType: string | undefined, slug: string | undefined) => {
      router.push( `/${shopType === "restaurant" ? "restaurant" : "store"}/${slug}/${FavRestaurantId}`);
    },
    500 // Debounce time in milliseconds
  );

  return (
    <div className="w-full py-6 flex flex-col gap-6">
      <HeaderFavourite
        title="Your Favourites"
        onSeeAllClick={handleSeeAllClick}
      />
      {isFavouriteRestaurantsLoading ? (
        <CardSkeletonGrid count={4} />
      ) : FavouriteRestaurantsData?.userFavourite && FavouriteRestaurantsData.userFavourite.length > 0 ? (
        <FavouriteCardsGrid items={FavouriteRestaurantsData.userFavourite}
        handleClickFavRestaurant={handleClickFavRestaurant}
        />
      ) : (
        <FavoritesEmptyState/>
      )}
    </div>
  );
};

export default FavouriteProducts;
