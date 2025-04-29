'use client';

// React imports
import { useContext } from 'react';

// Context imports
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';

// Component imports
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icon imports
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { useConfiguration } from '@/lib/hooks/useConfiguration';

export default function RestaurantsScreenHeader() {
  // Hooks
  const t = useTranslations();
  // Context
  const { onRestaurantsFormVisible } = useContext(RestaurantsContext);

  // Hooks
  const { IS_MULTIVENDOR, RESTURANT_COUNT } = useConfiguration();

  // Constants
  const IS_NOT_ALLOWED_MORE = !IS_MULTIVENDOR && (RESTURANT_COUNT || 0) >= 1;

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Stores')} />
        {!IS_NOT_ALLOWED_MORE && (
          <TextIconClickable
            className="rounded border-gray-300 bg-black text-white sm:w-auto"
            icon={faAdd}
            iconStyles={{ color: 'white' }}
            title={t('Add Store')}
            onClick={() => onRestaurantsFormVisible(true)}
          />
        )}
      </div>
    </div>
  );
}
