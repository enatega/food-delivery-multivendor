// Core
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Third-party libraries
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ApolloError, useMutation } from '@apollo/client';
import { Avatar } from 'primereact/avatar';

// Icons
import {
  faLocationDot,
  faStore,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { IRestaurantCardProps } from '@/lib/utils/interfaces';

// Methods
import { onUseLocalStorage } from '@/lib/utils/methods';

// GraphQL
import {
  DELETE_RESTAURANT,
  GET_RESTAURANTS_BY_OWNER,
  HARD_DELETE_RESTAURANT,
} from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';

// Components
import CustomButton from '../button';
import CustomInputSwitch from '../custom-input-switch';
import TextComponent from '../text-field';
import CustomLoader from '../custom-progress-indicator';
import { VendorLayoutRestaurantContext } from '@/lib/context/vendor/restaurant.context';
import { FrameSVG } from '@/lib/utils/assets/svgs/Frame';
import { CarSVG } from '@/lib/utils/assets/svgs/Car';
import { ConfigurationContext } from '@/lib/context/global/configuration.context';
import { useTranslations } from 'next-intl';

export default function VendorsLayoutRestaurantCard({
  restaurant,
}: IRestaurantCardProps) {
  // Props
  const {
    _id,
    name,
    image,
    address,
    shopType,
    isActive,
    unique_restaurant_id,
  } = restaurant;

  // Hooks
  const t = useTranslations();
  const { showToast } = useContext(ToastContext);

  const { vendorId, isRestaurantModifed, setRestaurantModifed } = useContext(
    VendorLayoutRestaurantContext
  );

  const configuration = useContext(ConfigurationContext);

  if (!configuration) {
    throw new Error(t('Cannot get the value of configuration context'));
  }

  const { deliveryRate } = configuration;
  // Hooks
  const router = useRouter();

  // API
  const [hardDeleteRestaurant, { loading: isHardDeleting }] = useMutation(
    HARD_DELETE_RESTAURANT,
    {
      refetchQueries: [
        {
          query: GET_RESTAURANTS_BY_OWNER,
          variables: {
            id: vendorId,
          },
        },
      ],
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('Store Delete'),
          message: `${t('Store has been deleted successfully')}.`,
          duration: 2000,
        });
      },
      onError: ({ networkError, graphQLErrors }: ApolloError) => {
        showToast({
          type: 'error',
          title: t('Store Delete'),
          message:
            graphQLErrors[0]?.message ??
            networkError?.message ??
            t(`Store delete failed`),
          duration: 2500,
        });
      },
    }
  );
  const [deleteRestaurant, { loading }] = useMutation(DELETE_RESTAURANT, {
    refetchQueries: [
      {
        query: GET_RESTAURANTS_BY_OWNER,
        variables: {
          id: vendorId,
        },
      },
    ],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: t('Store Status'),
        message: `${t('Store has been marked as')} ${isActive ? t('active') : t('in-active')}`,
      });
      setRestaurantModifed(!isRestaurantModifed);
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: t('Store Status'),
        message:
          graphQLErrors?.[0]?.message ??
          networkError?.message ??
          `${t('Store marked as')} ${isActive ? t('in-active') : t('active')} failed`,
      });
    },
  });

  // Handle checkbox change
  const handleCheckboxChange = async () => {
    try {
      await deleteRestaurant({ variables: { id: _id } });
    } catch (err) {
      console.log(err);
      showToast({
        type: 'error',
        title: t('Store Status'),
        message: `${t('Store marked as')} ${isActive ? t('active') : t('in-active')} failed`,
        duration: 2000,
      });
    }
  };

  const handleDelete = async () => {
    hardDeleteRestaurant({ variables: { id: _id } });
  };

  return (
    <div className="flex flex-col rounded-lg border-2 border-[#F4F4F5] dark:border-dark-600 bg-white dark:bg-dark-950 shadow-md">
      <div className="mb-4 flex items-center rounded-t-lg bg-gray-200 dark:bg-dark-900 p-4">
        {image ? (
          <Image
            src={image}
            alt={t('Store Logo')}
            className="mr-3 h-10 w-10 flex-shrink-0 rounded-full"
            width={40}
            height={40}
          />
        ) : (
          <Avatar
            icon={<FontAwesomeIcon icon={faStore} />}
            className="mr-3"
            size="large"
            shape="circle"
          />
        )}
        <div className="min-w-0 flex-grow">
          <TextComponent className={`card-h2 truncate`} text={name} />
          <TextComponent
            className={`card-h3 truncate text-gray-500 dark:text-white`}
            text={unique_restaurant_id}
          />
          <TextComponent
            className={`card-h3 truncate text-gray-500 dark:text-white`}
            text={shopType}
          />
        </div>
        <div className="flex space-x-2">
          <CustomInputSwitch
            loading={loading}
            isActive={isActive}
            onChange={handleCheckboxChange}
          />
          {isHardDeleting ? (
            <CustomLoader size="20px" />
          ) : (
            <FontAwesomeIcon
              icon={faTrash}
              className="cursor-pointer"
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
      <div className="mb-4 flex items-center gap-x-2 truncate px-4 text-sm dark:text-white text-gray-500">
        <FontAwesomeIcon icon={faLocationDot} />

        <TextComponent
          className={`card-h2 truncate text-gray-500 dark:text-white`}
          text={address}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-2 px-2 sm:grid sm:grid-cols-2 sm:gap-4 lg:flex">
        {/* Delivery Time */}
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-dark-600 p-2 mb-2 text-sm">
          <FrameSVG width="24" height="24" />
          <span>
            {restaurant?.deliveryTime} {t('min')}
          </span>
        </div>

        {/* Delivery Fee */}
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-dark-600 p-2 mb-2 text-sm">
          <CarSVG width="24" height="24" />
          <span>
            {'₪'} {deliveryRate}
          </span>
        </div>

        {/* Minimum Order */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-dark-600 p-2 mb-2 text-sm">
          <span>{t('Min Order')}</span>
          <span>
            {'₪'} {restaurant?.minimumOrder}
          </span>
        </div>
      </div>

      <div className="mb-2 px-4">
        <CustomButton
          className="h-10 w-full bg-primary-color  text-black dark:text-white"
          label={t('View Details')}
          onClick={() => {
            onUseLocalStorage('save', 'shopType', shopType )
            onUseLocalStorage('save', 'restaurantId', _id);
            // Get the existing route stack from local storage
            const existingRouteStack = JSON.parse(
              onUseLocalStorage('get', 'routeStack') || '[]'
            );

            // Add 'vendor' to the existing route stack
            const updatedRouteStack = [...existingRouteStack, 'Vendor'];
            // Save the updated route stack
            onUseLocalStorage(
              'save',
              'routeStack',
              JSON.stringify(updatedRouteStack)
            );
            router.push(`/admin/store/`);
          }}
        />
      </div>
    </div>
  );
}
