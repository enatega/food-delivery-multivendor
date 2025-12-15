// Core
import {
  LazyQueryResultTuple,
  QueryResult,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client';
import { useContext, useEffect, useMemo, useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import {
  IActionMenuItem,
  IAddon,
  IAddonByRestaurantResponse,
  IDropdownSelectItem,
  IFood,
  IFoodByRestaurantResponse,
  IFoodNew,
  IQueryResult,
  ISubCategoryResponse,
  ISubCategorySingleResponse,
  IVariationForm,
  IGetAllFoodsPaginatedResponse,
  IFoodWithCategory,
} from '@/lib/utils/interfaces';

// Components
import Table from '@/lib/ui/useable-components/table';
import { FOODS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/foods-columns';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

// Utilities and Data
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import { generateDummyFoods } from '@/lib/utils/dummy';

// Context
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Hooks
import useToast from '@/lib/hooks/useToast';

// GraphQL
import { DELETE_FOOD } from '@/lib/api/graphql';
import {
  GET_ADDONS_BY_RESTAURANT_ID,
  GET_FOODS_BY_RESTAURANT_ID,
  GET_ALL_FOODS_PAGINATED,
} from '@/lib/api/graphql/queries';
import {
  GET_SUBCATEGORIES,
  GET_SUBCATEGORY,
} from '@/lib/api/graphql/queries/sub-categories';
import { useTranslations } from 'next-intl';
import { ApolloError } from '@apollo/client';

// Cache keys
const CACHE_KEY_PREFIX = 'foods_table_';

// Helper to get cached value
const getCachedValue = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (e) {
    console.error('Error reading from cache:', e);
  }
  return defaultValue;
};

// Helper to set cached value
const setCachedValue = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to cache:', e);
  }
};

export default function FoodsMain() {
  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { onSetFoodContextData, onFoodFormVisible } = useContext(FoodsContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Cache keys specific to restaurant
  const cacheKeyPage = `${CACHE_KEY_PREFIX}${restaurantId}_page`;
  const cacheKeyPageSize = `${CACHE_KEY_PREFIX}${restaurantId}_pageSize`;
  const cacheKeySearch = `${CACHE_KEY_PREFIX}${restaurantId}_search`;

  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // State - Table (initialized from cache)
  const [foodItems, setFoodItems] = useState<IFoodNew[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState({ id: '', categoryId: '' });
  const [selectedProducts, setSelectedProducts] = useState<IFoodNew[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState(() =>
    getCachedValue<string>(cacheKeySearch, '')
  );
  const [debouncedSearch, setDebouncedSearch] = useState(() =>
    getCachedValue<string>(cacheKeySearch, '')
  );
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Pagination State (initialized from cache)
  const [currentPage, setCurrentPage] = useState(() =>
    getCachedValue<number>(cacheKeyPage, 1)
  );
  const [pageSize, setPageSize] = useState(() =>
    getCachedValue<number>(cacheKeyPageSize, 10)
  );
  const [totalRecords, setTotalRecords] = useState(0);

  // Cache current page when it changes
  useEffect(() => {
    if (restaurantId) {
      setCachedValue(cacheKeyPage, currentPage);
    }
  }, [currentPage, restaurantId, cacheKeyPage]);

  // Cache page size when it changes
  useEffect(() => {
    if (restaurantId) {
      setCachedValue(cacheKeyPageSize, pageSize);
    }
  }, [pageSize, restaurantId, cacheKeyPageSize]);

  // Cache search when debounced value changes
  useEffect(() => {
    if (restaurantId) {
      setCachedValue(cacheKeySearch, debouncedSearch);
    }
  }, [debouncedSearch, restaurantId, cacheKeySearch]);

  // Re-initialize from cache when restaurantId becomes available
  useEffect(() => {
    if (restaurantId) {
      const cachedPage = getCachedValue<number>(cacheKeyPage, 1);
      const cachedPageSize = getCachedValue<number>(cacheKeyPageSize, 10);
      const cachedSearch = getCachedValue<string>(cacheKeySearch, '');

      setCurrentPage(cachedPage);
      setPageSize(cachedPageSize);
      setGlobalFilterValue(cachedSearch);
      setDebouncedSearch(cachedSearch);
    }
  }, [restaurantId]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilterValue);
      // Only reset to first page if search actually changed
      if (globalFilterValue !== getCachedValue<string>(cacheKeySearch, '')) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [globalFilterValue]);

  // Error State
  const [apiError, setApiError] = useState<string | null>(null);

  // Query - Paginated Foods
  const {
    data: paginatedFoodsData,
    loading: paginatedLoading,
    refetch: refetchPaginatedFoods,
    error: paginatedError,
  } = useQueryGQL(
    GET_ALL_FOODS_PAGINATED,
    {
      restaurantId,
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch || null,
    },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onCompleted: onFetchPaginatedFoodsCompleted,
      onError: onErrorFetchPaginatedFoods,
    }
  ) as IQueryResult<
    IGetAllFoodsPaginatedResponse | undefined,
    {
      restaurantId: string;
      page: number;
      limit: number;
      search: string | null;
    }
  >;

  // Fallback Query - Old API for editing
  const {
    data: foodsData,
    loading: fallbackLoading,
    refetch: refetchFallbackFoods,
  } = useQueryGQL(
    GET_FOODS_BY_RESTAURANT_ID,
    { id: restaurantId },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
    }
  ) as IQueryResult<IFoodByRestaurantResponse | undefined, undefined>;

  const { data } = useQueryGQL(
    GET_ADDONS_BY_RESTAURANT_ID,
    { id: restaurantId },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
    }
  ) as IQueryResult<IAddonByRestaurantResponse | undefined, undefined>;

  const [fetchSubcategory, { loading: subCategoriesLoading }] = useLazyQuery(
    GET_SUBCATEGORY,
    {
      fetchPolicy: 'network-only',
      refetchWritePolicy: 'overwrite',
      onError(err) {
        console.log({ err });
      },
    }
  ) as LazyQueryResultTuple<
    ISubCategorySingleResponse | undefined,
    { id: string }
  >;

  const { data: sub_categories } = useQuery(
    GET_SUBCATEGORIES
  ) as QueryResult<ISubCategoryResponse>;

  // Mutation
  const [deleteFood, { loading: mutationLoading }] = useMutation(DELETE_FOOD, {
    refetchQueries: [
      {
        query: GET_ALL_FOODS_PAGINATED,
        variables: { restaurantId, page: currentPage, limit: pageSize, search: debouncedSearch || null },
      },
      {
        query: GET_FOODS_BY_RESTAURANT_ID,
        variables: { id: restaurantId },
      },
    ],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: t('Delete Food'),
        message: `${t('Food has been deleted successfully')}.`,
      });
      setDeleteId({ id: '', categoryId: '' });
      refetchPaginatedFoods({
        restaurantId,
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch || null,
      });
    },
    onError: (error: ApolloError) => {
      const errorMessage = error.graphQLErrors?.[0]?.message || error.message;
      showToast({
        type: 'error',
        title: t('Delete Failed'),
        message: errorMessage,
      });
    },
  });

  // Memoized Data
  const addons = useMemo(
    () =>
      data?.restaurant?.addons.map((addon: IAddon) => {
        return { label: addon.title, code: addon._id };
      }),
    [data?.restaurant?.addons]
  );

  // Transform paginated data to table format
  function onFetchPaginatedFoodsCompleted() {
    if (!paginatedFoodsData?.getAllfoodsPaginated) return;

    setApiError(null);
    setIsLoading(true);

    const paginationInfo = paginatedFoodsData.getAllfoodsPaginated;

    // Sync state with API response
    setTotalRecords(paginationInfo.totalFoods);
    setCurrentPage(paginationInfo.page);
    setPageSize(paginationInfo.limit);

    const refined_food_items: IFoodNew[] =
      paginationInfo.foods.map((item: IFoodWithCategory) => {
        const { category, food } = item;
        return {
          _id: food.id,
          title: food.title,
          description: '',
          image: food.image,
          isActive: food.isActive ? food.isActive : false,
          isOutOfStock: food.isOutOfStock ? food.isOutOfStock : false,
          inventory: food.inventory,
          uom: food.UOM,
          minQuantity: food.orderQuantity?.min,
          maxQuantity: food.orderQuantity?.max,
          __typename: 'Food',
          category: {
            code: category.id,
            label: category.title,
          },
          subCategory: food.subCategory
            ? {
                code: food.subCategory,
                label:
                  sub_categories?.subCategories.find(
                    (sub) => sub._id === food.subCategory
                  )?.title || '',
              }
            : null,
          variations: food.variations.map((v) => ({
            _id: v.id,
            title: v.title,
            price: v.price,
            discounted: 0,
            addons:
              v.addons?.map((addon) => ({
                label: addon.title,
                code: addon.title,
              })) || null,
            isOutOfStock: v.outofstock ?? false,
            deal: v.deal || null,
          })),
        };
      }) || [];

    setFoodItems(refined_food_items);
    setIsLoading(false);
  }

  // Error Handler
  function onErrorFetchPaginatedFoods(error: ApolloError) {
    const errorMessage =
      error.graphQLErrors?.[0]?.message ||
      error.message ||
      t('Foods fetch failed');

    setApiError(errorMessage);
    setFoodItems([]);
    setIsLoading(false);

    showToast({
      type: 'error',
      title: t('Foods Fetch Error'),
      message: errorMessage,
      duration: 5000,
    });
  }

  // Pagination Handler for Table component
  const handlePageChange = (page: number, rows: number) => {
    setCurrentPage(page);
    setPageSize(rows);

    refetchPaginatedFoods({
      restaurantId,
      page: page,
      limit: rows,
      search: debouncedSearch || null,
    });
  };

  // Constants
  const menuItems: IActionMenuItem<IFoodNew>[] = [
    {
      label: t('Edit'),
      command: async (data?: IFoodNew) => {
        if (subCategoriesLoading) {
          return console.log({ subCategoriesLoading });
        }

        const sub_ctg_id = foodsData?.restaurant.categories.flatMap((fd) =>
          fd.foods.filter((_fd) => _fd._id === data?._id)
        )[0]?.subCategory;

        if (sub_ctg_id) {
          await fetchSubcategory({
            variables: {
              id: sub_ctg_id || '',
            },
          });
        }

        if (data && !subCategoriesLoading) {
          let _variation = null;

          // Helper to safely parse date from API (handles both Unix timestamps and ISO strings)
          const parseDate = (dateValue: string | number | undefined): Date => {
            if (!dateValue) return new Date();
            const num = Number(dateValue);
            return !isNaN(num) && num > 0 ? new Date(num) : new Date(dateValue);
          };

          const _variations =
            (data?.variations?.map(({ discounted, deal, ...variation }) => {
              _variation = { ...variation };

              // Transform deal data to match form expectations
              let transformedDeal = null;
              if (deal && 'name' in deal) {
                // Type guard: deal is IFoodDealType (from API)
                transformedDeal = {
                  dealName: deal.name,
                  discountType: deal.type,
                  discountValue: deal.value,
                  startDate: parseDate(deal.startDate),
                  endDate: parseDate(deal.endDate),
                  isActive: deal.isActive,
                };
              }

              return {
                ..._variation,
                discounted: discounted,
                addons: variation?.addons || null,
                deal: transformedDeal,
              };
            }) as IVariationForm[]) ?? ([] as IVariationForm[]);

          if (!subCategoriesLoading) {
            await onSetFoodContextData({
              food: {
                _id: data._id ?? null,
                data: {
                  ...data,
                  minQuantity: data.minQuantity,
                  maxQuantity: data.maxQuantity,
                },
                variations: _variations,
              },
              isEditing: true,
            });
            onFoodFormVisible(true);
          }
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IFoodNew) => {
        if (data) {
          setDeleteId({ id: data._id, categoryId: data?.category?.code ?? '' });
        }
      },
    },
  ];

  // Use Effect
  useEffect(() => {
    if (paginatedFoodsData?.getAllfoodsPaginated) {
      onFetchPaginatedFoodsCompleted();
    }
  }, [paginatedFoodsData, paginatedLoading]);

  return (
    <div className="p-3">
      {/* Error Banner */}
      {apiError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                {t('GraphQL Error')}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {apiError}
              </p>
            </div>
            <button
              onClick={() => {
                setApiError(null);
                refetchPaginatedFoods({
                  restaurantId,
                  page: currentPage,
                  limit: pageSize,
                  search: debouncedSearch || null,
                });
              }}
              className="flex-shrink-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative w-full max-w-md">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            value={globalFilterValue}
            onChange={(e) => setGlobalFilterValue(e.target.value)}
            placeholder={t('Search products...')}
            className="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white py-2 pl-10 pr-10 text-sm focus:border-primary-color focus:outline-none focus:ring-1 focus:ring-primary-color placeholder:text-gray-500 dark:placeholder:text-gray-500"
          />
          {globalFilterValue && (
            <button
              onClick={() => setGlobalFilterValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Table
        data={
          foodItems ||
          (paginatedLoading || isLoading ? generateDummyFoods() : [])
        }
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={paginatedLoading || isLoading}
        columns={FOODS_TABLE_COLUMNS({
          menuItems,
          currentPage,
          pageSize,
        })}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        rowsPerPage={pageSize}
      />

      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId?.id}
        onHide={() => {
          setDeleteId({ id: '', categoryId: '' });
        }}
        onConfirm={() => {
          deleteFood({
            variables: { ...deleteId, restaurant: restaurantId },
          });
        }}
        message={t('Are you sure you want to delete this option?')}
      />
    </div>
  );
}
