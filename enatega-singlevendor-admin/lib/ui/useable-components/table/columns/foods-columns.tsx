// import ActionMenu from '../../action-menu';
import Image from 'next/image';
import { normalizeManagedMediaUrl } from '@/lib/utils/media';

// Interface
import { IActionMenuProps, IFoodNew } from '@/lib/utils/interfaces';

import ActionMenu from '../../action-menu';
import { useMutation } from '@apollo/client';
import {
  UPDATE_FOOD_OUT_OF_STOCK,
  GET_ALL_FOODS_PAGINATED,
} from '@/lib/api/graphql';
import { useContext, useRef, useState } from 'react';
import { ToastContext } from '@/lib/context/global/toast.context';
import CustomInputSwitch from '../../custom-input-switch';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useTranslations } from 'next-intl';

export const FOODS_TABLE_COLUMNS = ({
  menuItems,
  currentPage = 1,
  pageSize = 10,
}: {
  menuItems: IActionMenuProps<IFoodNew>['items'];
  currentPage?: number;
  pageSize?: number;
}) => {
  // Hooks
  const t = useTranslations();

  // Context
  const { showToast } = useContext(ToastContext);
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);

  // State
  const [pendingFoodId, setPendingFoodId] = useState<string>('');
  const [optimisticStock, setOptimisticStock] = useState<
    Record<string, boolean>
  >({});
  const pendingFoodIdsRef = useRef(new Set<string>());

  // API
  const [updateFoodOutOfStock] = useMutation(UPDATE_FOOD_OUT_OF_STOCK, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ALL_FOODS_PAGINATED,
        variables: {
          restaurantId,
          page: currentPage,
          limit: pageSize,
        },
      },
    ],
  });

  // Handlers
  const onUpdateFoodOutOfStock = async (
    foodId: string,
    categoryId: string,
    currentStatus: boolean
  ) => {
    if (pendingFoodIdsRef.current.size > 0) return;

    pendingFoodIdsRef.current.add(foodId);
    setPendingFoodId(foodId);
    setOptimisticStock((previous) => ({
      ...previous,
      [foodId]: !currentStatus,
    }));

    try {
      const { data } = await updateFoodOutOfStock({
        variables: {
          id: foodId,
          categoryId,
          restaurant: restaurantId,
        },
      });

      if (!data?.updateFoodOutOfStock) {
        throw new Error(t('Food Stock status failed'));
      }

      showToast({
        type: 'success',
        title: t('Food Stock'),
        message: t('Food stock status has been changed'),
      });
    } catch {
      showToast({
        type: 'error',
        title: t('Food Stock'),
        message: t('Food Stock status failed'),
      });
    } finally {
      pendingFoodIdsRef.current.delete(foodId);
      setPendingFoodId((pendingId) => (pendingId === foodId ? '' : pendingId));
      setOptimisticStock((previous) => {
        const next = { ...previous };
        delete next[foodId];
        return next;
      });
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
      headerName: t('Deal'),
      propertyName: 'deal',
      body: (item: IFoodNew) => {
        // Get all variations with deals
        const variationsWithDeals =
          item?.variations?.filter((v) => v.deal) || [];

        if (variationsWithDeals.length === 0) {
          return (
            <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
          );
        }

        // Helper to get deal info (handles IFoodDealType, IDealFormValues, and IDeal)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getDealInfo = (deal: any) => {
          let name: string;
          let type: string;
          let value: number;

          if ('name' in deal && typeof deal.name === 'string') {
            // This is IFoodDealType
            name = deal.name;
            type = deal.type || '';
            value = deal.value || 0;
          } else if ('dealName' in deal && deal.dealName) {
            // This is IDealFormValues or IDeal with dealName
            name = deal.dealName;
            type = deal.discountType || '';
            value = deal.discountValue || 0;
          } else if ('title' in deal && deal.title) {
            // This is IDeal with title
            name = deal.title;
            type = deal.discountType || '';
            value = deal.discountValue || 0;
          } else {
            name = '';
            type = '';
            value = 0;
          }

          const symbol = type === 'PERCENTAGE' ? '%' : '€';
          return { name, type, value, symbol };
        };

        // If only one variation has a deal, show it directly
        if (variationsWithDeals.length === 1) {
          const variation = variationsWithDeals[0];
          const { name, value, symbol } = getDealInfo(variation.deal);
          return (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md inline-block w-fit">
                {name}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {variation.title}: {value}
                {symbol} Off
              </span>
            </div>
          );
        }

        // If multiple variations have deals, show them in a compact list
        return (
          <div className="flex flex-col gap-1 max-w-[200px]">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {variationsWithDeals.length}{' '}
              {variationsWithDeals.length === 1 ? 'Deal' : 'Deals'}
            </span>
            <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto">
              {variationsWithDeals.map((variation, index) => {
                const { value, symbol } = getDealInfo(variation.deal);
                return (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded inline-block">
                      {variation.title}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {value}
                      {symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
    },
    {
      headerName: t('Image'),
      propertyName: 'image',
      body: (item: IFoodNew) =>
        item.image ? (
          <Image
            src={normalizeManagedMediaUrl(item.image)}
            width={40}
            height={40}
            alt="item.png"
          />
        ) : (
          <></>
        ),
    },
    {
      headerName: t('Out of Stock'),
      propertyName: 'isOutOfStock',
      body: (item: IFoodNew) => {
        const displayedStatus = optimisticStock[item._id] ?? item.isOutOfStock;
        const isPending = pendingFoodId === item._id;

        return (
          <CustomInputSwitch
            loading={isPending}
            disabled={pendingFoodId !== ''}
            isActive={displayedStatus}
            onChange={() =>
              onUpdateFoodOutOfStock(
                item._id,
                item.category?.code ?? '',
                displayedStatus
              )
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
