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
import { DELETE_RESTAURANT, HARD_DELETE_RESTAURANT } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import { RestaurantContext } from '@/lib/context/super-admin/restaurant.context';
import { ConfigurationContext } from '@/lib/context/global/configuration.context';

// Components
import CustomButton from '../button';
import CustomInputSwitch from '../custom-input-switch';
import TextComponent from '../text-field';
import CustomLoader from '../custom-progress-indicator';
import { CarSVG } from '@/lib/utils/assets/svgs/Car';
import { FrameSVG } from '@/lib/utils/assets/svgs/Frame';
import { useTranslations } from 'next-intl';

export default function RestaurantCard({ restaurant }: IRestaurantCardProps) {
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

  const configuration = useContext(ConfigurationContext);
  // Hooks
  const t = useTranslations();
  const { showToast } = useContext(ToastContext);

  if (!configuration) {
    throw new Error(t('Cannot get the value of the Configuration Context'));
  }

  const { deliveryRate, isPaidVersion } = configuration;

  const {
    restaurantByOwnerResponse,
    isRestaurantModifed,
    setRestaurantModifed,
  } = useContext(RestaurantContext);

  // Hooks
  const router = useRouter();

  // API
  const [hardDeleteRestaurant, { loading: isHardDeleting }] = useMutation(
    HARD_DELETE_RESTAURANT,
    {
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('Store Delete'),
          message: `${t('Store has been deleted successfully')}.`,
          duration: 2000,
        });
        restaurantByOwnerResponse.refetch();
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
    onCompleted: () => {
      showToast({
        type: 'success',
        title: t('Store Status'),
        message: `${t('Store has been marked as')} ${isActive ? t('active') : t('in-active')}`,
        duration: 2000,
      });
      setRestaurantModifed(!isRestaurantModifed);
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: t('Store Status'),
        message:
          graphQLErrors[0]?.message ??
          networkError?.message ??
          `${t('Store marked as')} ${isActive ? t('active') : t('in-active')} failed`,
        duration: 2500,
      });
    },
  });

  // Handle checkbox change
  const handleCheckboxChange = async () => {
    try {
      await deleteRestaurant({ variables: { id: _id } });
    } catch (err) {
      console.log({ err });
    }
  };

  const handleDelete = async () => {
    if(isPaidVersion) {
    hardDeleteRestaurant({ variables: { id: _id } });
  }else {
    showToast({
      type: 'error',
      title: t('You are using free version'),
      message: t('This Feature is only Available in Paid Version'),
    });
  }
}

  return (
    <div className="flex flex-col rounded-lg border-2 border-[#F4F4F5] dark:text-white dark:border-dark-600 dark:bg-dark-950 bg-white shadow-md">
      <div className="mb-4 flex items-center rounded-t-lg bg-gray-200 dark:bg-dark-900 p-4">
        {image ? (
          <Image
            src={image}
            alt={t('Store logo')}
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
          <TextComponent className={` dark:text-white card-h2 truncate`} text={name} />
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
      <div className="mb-4 flex items-center gap-x-2 truncate px-4 text-sm text-gray-500 dark:text-white">
        <FontAwesomeIcon icon={faLocationDot} />

        <TextComponent
          className={`card-h2 truncate text-gray-500 dark:text-white`}
          text={address}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-2 px-2 sm:grid sm:grid-cols-2 sm:gap-4 lg:flex">
        {/* Delivery Time */}
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-1 mb-2 text-sm">
          <FrameSVG width="24" height="24" />
          <span>
            {restaurant?.deliveryTime} {t('min')}
          </span>
        </div>

        {/* Delivery Fee */}
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-1 mb-2 text-sm">
          <CarSVG width="24" height="24" />
          <span>
            {'₪'} {deliveryRate}
          </span>
        </div>

        {/* Minimum Order */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-300 p-2 mb-2 text-sm">
          <span>{t('Min Order')}</span>
          <span>
            {'₪'} {restaurant?.minimumOrder}
          </span>
        </div>
      </div>
      <div className="mb-2 px-4">
        <CustomButton
          className="h-10 w-full bg-primary-color text-black dark:text-white"
          label={t('View Details')}
          onClick={() => {
            onUseLocalStorage('save', 'restaurantId', _id);
            onUseLocalStorage('save', 'shopType', shopType)
            const routeStack = ['Admin'];
            onUseLocalStorage('save', 'routeStack', JSON.stringify(routeStack));
            router.push(`/admin/store/`);
          }}
        />
      </div>
    </div>
  );
}
