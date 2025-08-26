// Interfaces
import {
  IFood,
  IFoodByRestaurantResponse,
  IFoodCategory,
  IFoodNew,
} from '../../interfaces';

export const onTransformRetaurantsByIdToFoods = ({
  restaurant,
}: IFoodByRestaurantResponse): IFoodNew[] => {
  const foods: IFoodNew[] = [];

  restaurant.categories.map((category: IFoodCategory) => {
    return category.foods.map((food: IFood) => {
      foods.push({
        __typename: food.__typename,
        isActive: food.isActive,
        _id: food._id,
        title: food.title,
        description: food.description,
        category: { label: category.title, code: category._id },
        image: food.image,
        isOutOfStock: food.isOutOfStock,
        variations: food.variations ?? [],
        subCategory: {
          code: food.subCategory,
          label: food.subCategory,
        },
      });
    });
  });

  return foods;
};
