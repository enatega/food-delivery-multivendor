// import ActionMenu from '../../action-menu';
import Image from 'next/image';

// Interface
import { IActionMenuProps, IFoodNew } from '@/lib/utils/interfaces';

import ActionMenu from '../../action-menu';
import { ApolloError, useMutation } from '@apollo/client';
import {
  GET_FOODS_BY_RESTAURANT_ID,
  UPDATE_FOOD_OUT_OF_STOCK,
} from '@/lib/api/graphql';
import { useContext, useState } from 'react';
import { ToastContext } from '@/lib/context/global/toast.context';
import CustomInputSwitch from '../../custom-input-switch';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useTranslations } from 'next-intl';

export const FOODS_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IFoodNew>['items'];
}) => {
  // Hooks
  const t = useTranslations();

  // Context
  const { showToast } = useContext(ToastContext);
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);

  // State
  const [isFoodLoading, setIsFoodLoading] = useState<string>('');

  // API
  const [updateFoodOutOfStock] = useMutation(UPDATE_FOOD_OUT_OF_STOCK, {
    refetchQueries: [
      {
        query: GET_FOODS_BY_RESTAURANT_ID,
        variables: { id: restaurantId },
      },
    ],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: t('Food Stock'),
        message: t(`Food stock status has been changed`),
      });
      setIsFoodLoading('');
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: t('Food Stock'),
        message:
          networkError?.message ??
          graphQLErrors[0]?.message ??
          t('Food Stock status failed'),
      });
      setIsFoodLoading('');
    },
  });

  // Handlers
  const onUpdateFoodOutOfStock = async (foodId: string, categoryId: string) => {
    try {
      setIsFoodLoading(foodId);

      await updateFoodOutOfStock({
        variables: {
          id: foodId,
          categoryId,
          restaurant: restaurantId,
        },
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: t('Food Stock'),
        message: t('Food Stock status failed'),
      });
      setIsFoodLoading('');
    }
  };

  return [
    { headerName: t('Title'), propertyName: 'title' },
    { headerName: t('Description'), propertyName: 'description' },
    {
      headerName: t('Category'),
      propertyName: 'category.label',
      body: (item: IFoodNew) => <div>{item?.category?.label ?? ''}</div>,
    },
    {
      headerName: t('Image'),
      propertyName: 'image',
      body: (item: IFoodNew) =>
        item.image ? (
          <Image src={item.image} width={40} height={40} alt="item.png" />
        ) : (
          <></>
        ),
    },
    {
      headerName: t('Out of Stock'),
      propertyName: 'isOutOfStock',
      body: (item: IFoodNew) => {
        return (
          <CustomInputSwitch
            loading={isFoodLoading === item._id}
            isActive={item.isOutOfStock}
            onChange={() =>
              onUpdateFoodOutOfStock(item._id, item.category?.code ?? '')
            }
          />
        );
      },
    },
    {
      propertyName: 'actions',
      body: (option: IFoodNew) => {
        return <ActionMenu items={menuItems} data={option} />;
      },
    },
  ];
};
