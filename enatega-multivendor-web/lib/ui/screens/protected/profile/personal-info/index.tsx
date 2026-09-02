"use client";

import { FavouriteProducts, PersonalInfoMain } from "@/lib/ui/screen-components/protected/profile";
import { useAppMode } from "@/lib/mode";
import { FavoriteProducts } from "@/lib/ui/single-vendor/ProfileExtras";

  export default function PersonalInfoScreen() {
    const { isSingleVendor } = useAppMode();
    return (
      <div className="flex flex-col space-y-10 my-10">
        {/* Main Profile */}
       <PersonalInfoMain/>
       {/* Favourites Items  */}
       {isSingleVendor ? <FavoriteProducts /> : <FavouriteProducts/>}
      </div>
    );
  }
  
