// Hooks
import { useContext, useState } from 'react';

// Components
import CategoryAddForm from '@/lib/ui/screen-components/protected/restaurant/category/add-form';
import CategoryHeader from '@/lib/ui/screen-components/protected/restaurant/category/view/header/screen-header';
import CategoryMain from '@/lib/ui/screen-components/protected/restaurant/category/view/main';
import SubCategoriesAddForm from '@/lib/ui/screen-components/protected/restaurant/category/add-subcategories';

// Contexts
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';


export default function CategoryScreen() {
  // Contexts
  const {isAddSubCategoriesVisible, setIsAddSubCategoriesVisible, category, setCategory, subCategories, setSubCategories} = useContext(RestaurantLayoutContext)
  
  // State
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);

  return (
    <div className="screen-container">
      <CategoryHeader setIsAddCategoryVisible={setIsAddCategoryVisible} />

      <CategoryMain
        setIsAddCategoryVisible={setIsAddCategoryVisible}
        setIsAddSubCategoriesVisible={setIsAddSubCategoriesVisible}
        setCategory={setCategory}
        setSubCategories={setSubCategories}
      />
      {/* Sub Categories Form  */}
      <SubCategoriesAddForm
      onHide={() => {
        setIsAddSubCategoriesVisible({
          bool:false,
          parentCategoryId:''
        });
        setCategory(null);
        setSubCategories([])
      }}
      isAddSubCategoriesVisible={isAddSubCategoriesVisible}
      category={category}
      />
      {/* Parent Categories Forms  */}
      <CategoryAddForm
        category={category}
        subCategories={subCategories}
        onHide={() => {
          setIsAddCategoryVisible(false);
          setCategory(null);
          setSubCategories([])
        }}
        isAddCategoryVisible={isAddCategoryVisible}
      />
    </div>
  );
}
