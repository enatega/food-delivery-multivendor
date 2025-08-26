"use client";

import { FavouriteProducts, PersonalInfoMain } from "@/lib/ui/screen-components/protected/profile";

  export default function PersonalInfoScreen() {
    return (
      <div className="flex flex-col space-y-10 my-10">
        {/* Main Profile */}
       <PersonalInfoMain/>
       {/* Favourites Items  */}
       <FavouriteProducts/>
      </div>
    );
  }
  