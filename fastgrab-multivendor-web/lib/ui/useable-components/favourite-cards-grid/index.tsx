import FavoriteCard from "@/lib/ui/useable-components/favourite-card";
import { IFavouriteRestaurantItem } from "@/lib/utils/interfaces/favourite.restaurants.interface";
import { twMerge } from "tailwind-merge";

interface IFavouriteGridProps {
  items: IFavouriteRestaurantItem[];
  handleClickFavRestaurant: (id:string|undefined, shopType: string | undefined, slug: string | undefined)=> void
  type?: string | null;
}

const FavouriteCardsGrid: React.FC<IFavouriteGridProps> = (props) => {
   const { items, handleClickFavRestaurant, type=null } = props;

  const handleClick = (FavRestaurantId:string|undefined, shopType: string | undefined, slug: string | undefined)=>{
    handleClickFavRestaurant?.(FavRestaurantId, shopType, slug)
  }
     // Force it to show all items if specifically "seeAllFavourites" is passed
  const displayItems = type === "seeAllFavourites" ? items : items.slice(0, 4);
  return (
    <div className={twMerge("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 sm:gap-6"
    )}>
      {displayItems.map((item) => (
        <div key={item._id} className="w-full" 
        onClick={()=>handleClick(item._id,item.shopType, item.slug)}
        >
          <FavoriteCard item={item} />
        </div>
      ))}
    </div>
  );
};

export default FavouriteCardsGrid;
