// Components
import FoodForm from '@/lib/ui/screen-components/protected/restaurant/food/form/add-form';
import FoodHeader from '@/lib/ui/screen-components/protected/restaurant/food/view/header/screen-header';
import FoodsMain from '@/lib/ui/screen-components/protected/restaurant/food/view/main';

// Hooks
import { useContext } from 'react';

// Contexts
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import SubCategoriesAddForm from '@/lib/ui/screen-components/protected/restaurant/category/add-subcategories';

export default function FoodScreen() {
  // Contexts
  const {
    isAddSubCategoriesVisible,
    setIsAddSubCategoriesVisible,
    category,
    setCategory,
    setSubCategories,
  } = useContext(RestaurantLayoutContext);
  return (
    <div className="screen-container">
      <FoodHeader />
      <SubCategoriesAddForm
        onHide={() => {
          setIsAddSubCategoriesVisible({
            bool: false,
            parentCategoryId: '',
          });
          setCategory(null);
          setSubCategories([]);
        }}
        isAddSubCategoriesVisible={isAddSubCategoriesVisible}
        category={category}
      />
      <FoodsMain />
      <FoodForm />
    </div>
  );
}
