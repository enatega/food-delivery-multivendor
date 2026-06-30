import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS_PAGINATED } from '@/lib/api/graphql/queries/ratings';
import CustomDataView from '@/lib/ui/useable-components/data-view';
import RatingsHeaderDataView from '../header/table-header';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import RatingSkeleton from '@/lib/ui/useable-components/custom-skeletons/rating.card.skeleton';
import { IReview } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';
import useDebounce from '@/lib/hooks/useDebounce';

const RatingMain: React.FC = () => {
  // Hooks
  const t = useTranslations();

  // States
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;
  const debouncedSearch = useDebounce(searchTerm, 500);

  const ratingRange =
    selectedActions.length === 1 ? selectedActions[0] : undefined;
  const minRating =
    ratingRange === '1-2 stars'
      ? 1
      : ratingRange === '3-4 stars'
        ? 3
        : ratingRange === '5 stars'
          ? 5
          : undefined;
  const maxRating =
    ratingRange === '1-2 stars'
      ? 2
      : ratingRange === '3-4 stars'
        ? 4
        : ratingRange === '5 stars'
          ? 5
          : undefined;

  const { loading, error, data } = useQuery(GET_REVIEWS_PAGINATED, {
    variables: {
      restaurantId,
      page: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch || undefined,
      minRating,
      maxRating,
    },
    fetchPolicy: 'network-only',
    skip: !restaurantId,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, ratingRange]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  if (loading) return <RatingSkeleton />;
  if (error)
    return (
      <p>
        {t('Error')}: {error.message}
      </p>
    );

  return (
    <div className="p-3">
      {!data || !data.restaurantReviewsPaginated?.data?.length ? (
        <div className="text-center">
          <p className="mt-8 text-gray-600 dark:text-white">{t('No records found')}</p>
        </div>
      ) : (
        <CustomDataView
          products={data.restaurantReviewsPaginated.data as IReview[]}
          header={
            <RatingsHeaderDataView
              setSelectedActions={setSelectedActions}
              selectedActions={selectedActions}
              onSearch={handleSearch}
            />
          }
          rows={rowsPerPage}
          totalRecords={data.restaurantReviewsPaginated.totalCount}
          first={(currentPage - 1) * rowsPerPage}
          lazy
          onPage={(event) => {
            setCurrentPage(Math.floor(event.first / event.rows) + 1);
            setRowsPerPage(event.rows);
          }}
        />
      )}
    </div>
  );
};

export default RatingMain;
