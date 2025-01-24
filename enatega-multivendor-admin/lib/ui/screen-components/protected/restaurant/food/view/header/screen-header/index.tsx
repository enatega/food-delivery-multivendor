// Interface and Types

// Components
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

const FoodHeader = () => {
  // Hooks
  const t = useTranslations();

  // Context
  const { onFoodFormVisible } = useContext(FoodsContext);

  return (
    <div className="w-full flex-shrink-0 sticky top-0 bg-white z-10 shadow-sm p-3">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Products')} />
        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={t('Add Product')}
          onClick={() => onFoodFormVisible(true)}
        />
      </div>
    </div>
  );
};

export default FoodHeader;
